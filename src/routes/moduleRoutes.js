const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { authenticateToken } = require('../middleware/authMiddleware');

// Helper function to transform module data for client use
function transformModuleForClient(module) {
    if (!module) return null;
    
    // Create a copy of the module
    const transformedModule = { ...module };
    
    // Convert tags string to skills array if available
    if (transformedModule.tags) {
        transformedModule.skills = transformedModule.tags.split(',').map(skill => skill.trim());
    } else {
        transformedModule.skills = [];
    }
    
    return transformedModule;
}

// Get all modules
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const modules = await db.collection('modules').find().toArray();
        
        // Transform modules for client use
        const transformedModules = modules.map(transformModuleForClient);
        
        res.json(transformedModules);
    } catch (error) {
        console.error('Error getting modules:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get random modules
router.get('/random', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const count = parseInt(req.query.count) || 5;
        
        // Get random modules
        const modules = await db.collection('modules')
            .aggregate([{ $sample: { size: count } }])
            .toArray();
        
        // Transform modules for client use
        const transformedModules = modules.map(transformModuleForClient);
        
        res.json(transformedModules);
    } catch (error) {
        console.error('Error getting random modules:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get modules for a specific scenario
router.get('/by-scenario/:scenarioId', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scenarioId = parseInt(req.params.scenarioId);
        
        // Get the scenario to check its moduleId
        const scenario = await db.collection('scenarios').findOne({ scenarioId });
        
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        
        const modules = [];
        
        // First, get the primary module associated with the scenario
        const primaryModule = await db.collection('modules').findOne({ moduleId: scenario.moduleId });
        if (primaryModule) {
            modules.push(transformModuleForClient(primaryModule));
        }
        
        // If we want to return additional related modules (based on category, tags, etc.)
        if (primaryModule) {
            const relatedModules = await db.collection('modules')
                .find({ 
                    category: primaryModule.category,
                    moduleId: { $ne: primaryModule.moduleId } // exclude the primary module
                })
                .limit(4)
                .toArray();
            
            // Transform related modules for client use
            const transformedRelatedModules = relatedModules.map(transformModuleForClient);
            modules.push(...transformedRelatedModules);
        }
        
        res.json(modules);
    } catch (error) {
        console.error('Error getting modules for scenario:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific module by ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const module = await db.collection('modules').findOne({ moduleId: parseInt(req.params.id) });
        
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        
        // Transform module for client use
        const transformedModule = transformModuleForClient(module);
        
        res.json(transformedModule);
    } catch (error) {
        console.error('Error getting module:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 