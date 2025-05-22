const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { Int32, Double } = require('mongodb');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all scenarios
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scenarios = await db.collection('scenarios').find().toArray();
        res.json(scenarios);
    } catch (error) {
        console.error('Error getting scenarios:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new scenario
router.post('/', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { moduleId, title, description, difficulty, duration, requiresVoice, 
                maxParticipants, passingScore, creatorId, organizationId,
                aiModelConfig, feedbackType, version, imageUrl } = req.body;
        
        // Validate required fields
        if (!moduleId || !title || !description || !difficulty || !duration || requiresVoice === undefined || 
            !maxParticipants || !passingScore || !creatorId || !organizationId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Get the next scenario ID
        const maxScenarioId = await db.collection('scenarios')
            .find()
            .sort({ scenarioId: -1 })
            .limit(1)
            .toArray();
        
        const scenarioId = maxScenarioId.length > 0 ? maxScenarioId[0].scenarioId + 1 : 1;
        
        // Create the new scenario with proper field mapping and BSON types
        const newScenario = {
            scenarioId: new Int32(scenarioId),
            moduleId: new Int32(moduleId),
            scenarioTitle: title,
            scenarioDescription: description,
            difficultyLevel: difficulty.toLowerCase(), // Ensure lowercase to match enum
            durationMinutes: new Int32(duration),
            requiresVoice: Boolean(requiresVoice),
            maxParticipants: new Int32(maxParticipants),
            passingScore: new Double(passingScore),
            creatorId: new Int32(creatorId),
            organizationId: new Int32(organizationId),
            aiModelConfig: aiModelConfig || '{}',
            feedbackType: (feedbackType || 'comprehensive').toLowerCase(), // Ensure lowercase to match enum
            version: version || '1.0',
            imageUrl: imageUrl || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const result = await db.collection('scenarios').insertOne(newScenario);
        
        if (result.acknowledged) {
            // Transform back to client format for the response
            const clientScenario = {
                scenarioId: newScenario.scenarioId.value,
                moduleId: newScenario.moduleId.value,
                title: newScenario.scenarioTitle,
                description: newScenario.scenarioDescription,
                difficulty: newScenario.difficultyLevel,
                duration: newScenario.durationMinutes.value,
                requiresVoice: newScenario.requiresVoice,
                maxParticipants: newScenario.maxParticipants.value,
                passingScore: newScenario.passingScore.value,
                creatorId: newScenario.creatorId.value,
                organizationId: newScenario.organizationId.value,
                aiModelConfig: newScenario.aiModelConfig,
                feedbackType: newScenario.feedbackType,
                version: newScenario.version,
                imageUrl: newScenario.imageUrl
            };
            
            // Add the scenario to all users in the same organization
            try {
                // Get all users in the organization
                const orgUsers = await db.collection('users')
                    .find({ organizationId: newScenario.organizationId.value })
                    .toArray();
                
                console.log(`Adding scenario ${newScenario.scenarioId.value} to ${orgUsers.length} users in organization ${newScenario.organizationId.value}`);
                
                // For each user, add the scenario to their list
                for (const user of orgUsers) {
                    // Check if user already has a scenarios entry
                    const userScenarios = await db.collection('user_scenarios').findOne({ userId: user.userId });
                    
                    if (userScenarios) {
                        // Add to existing list if not already there
                        if (!userScenarios.scenarios.includes(newScenario.scenarioId.value)) {
                            await db.collection('user_scenarios').updateOne(
                                { userId: user.userId },
                                { $push: { scenarios: newScenario.scenarioId.value } }
                            );
                        }
                    } else {
                        // Create new user_scenarios entry
                        await db.collection('user_scenarios').insertOne({
                            userId: user.userId,
                            scenarios: [newScenario.scenarioId.value]
                        });
                    }
                }
            } catch (error) {
                console.error('Error adding scenario to organization users:', error);
                // Continue with the response even if this part fails
            }
            
            res.status(201).json(clientScenario);
        } else {
            res.status(500).json({ message: 'Failed to create scenario' });
        }
    } catch (error) {
        console.error('Error creating scenario:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get scenarios for a specific user
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = parseInt(req.params.userId);
        
        // Check if the user exists
        const user = await db.collection('users').findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get user's scenario list (from user_scenarios collection)
        const userScenarios = await db.collection('user_scenarios')
            .findOne({ userId });
        
        if (!userScenarios || !userScenarios.scenarios || userScenarios.scenarios.length === 0) {
            return res.json([]);
        }
        
        // Get the full scenario details
        const scenarios = await db.collection('scenarios')
            .find({ scenarioId: { $in: userScenarios.scenarios } })
            .toArray();
        
        // Map database field names to client-expected field names
        const clientScenarios = scenarios.map(scenario => ({
            scenarioId: scenario.scenarioId,
            moduleId: scenario.moduleId,
            title: scenario.scenarioTitle || scenario.title,
            description: scenario.scenarioDescription || scenario.description,
            difficulty: scenario.difficultyLevel || scenario.difficulty,
            duration: scenario.durationMinutes || scenario.duration,
            requiresVoice: scenario.requiresVoice,
            maxParticipants: scenario.maxParticipants,
            passingScore: scenario.passingScore,
            creatorId: scenario.creatorId,
            organizationId: scenario.organizationId,
            aiModelConfig: scenario.aiModelConfig,
            feedbackType: scenario.feedbackType,
            version: scenario.version,
            imageUrl: scenario.imageUrl
        }));
        
        res.json(clientScenarios);
    } catch (error) {
        console.error('Error getting user scenarios:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get scenarios for a specific organization
router.get('/organization/:organizationId', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const organizationId = parseInt(req.params.organizationId);
        
        // Check if the organization exists
        const organization = await db.collection('organizations').findOne({ organizationId });
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        
        // Get scenarios created by this organization
        const scenarios = await db.collection('scenarios')
            .find({ organizationId })
            .toArray();
            
        // Map database field names to client-expected field names
        const clientScenarios = scenarios.map(scenario => ({
            scenarioId: scenario.scenarioId,
            moduleId: scenario.moduleId,
            title: scenario.scenarioTitle || scenario.title,
            description: scenario.scenarioDescription || scenario.description,
            difficulty: scenario.difficultyLevel || scenario.difficulty,
            duration: scenario.durationMinutes || scenario.duration,
            requiresVoice: scenario.requiresVoice,
            maxParticipants: scenario.maxParticipants,
            passingScore: scenario.passingScore,
            creatorId: scenario.creatorId,
            organizationId: scenario.organizationId,
            aiModelConfig: scenario.aiModelConfig,
            feedbackType: scenario.feedbackType,
            version: scenario.version,
            imageUrl: scenario.imageUrl
        }));
        
        res.json(clientScenarios);
    } catch (error) {
        console.error('Error getting organization scenarios:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get a specific scenario by ID
router.get('/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scenario = await db.collection('scenarios').findOne({ scenarioId: parseInt(req.params.id) });
        
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        
        res.json(scenario);
    } catch (error) {
        console.error('Error getting scenario:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a scenario to a user's list
router.post('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = parseInt(req.params.userId);
        const { scenarioId } = req.body;
        
        if (!scenarioId) {
            return res.status(400).json({ message: 'ScenarioId is required' });
        }
        
        // Check if the user exists
        const user = await db.collection('users').findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Check if the scenario exists
        const scenario = await db.collection('scenarios').findOne({ scenarioId });
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        
        // Add to user_scenarios collection (create if doesn't exist)
        const userScenarios = await db.collection('user_scenarios').findOne({ userId });
        
        if (userScenarios) {
            // Check if scenario is already in user's list
            if (userScenarios.scenarios.includes(scenarioId)) {
                return res.status(400).json({ message: 'Scenario already added to user' });
            }
            
            // Add to existing list
            await db.collection('user_scenarios').updateOne(
                { userId },
                { $push: { scenarios: scenarioId } }
            );
        } else {
            // Create new user_scenarios entry
            await db.collection('user_scenarios').insertOne({
                userId,
                scenarios: [scenarioId]
            });
        }
        
        res.status(201).json({ message: 'Scenario added to user' });
    } catch (error) {
        console.error('Error adding scenario to user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove a scenario from a user's list
router.delete('/user/:userId/:scenarioId', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const userId = parseInt(req.params.userId);
        const scenarioId = parseInt(req.params.scenarioId);
        
        // Check if the user exists
        const user = await db.collection('users').findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove from user_scenarios collection
        const result = await db.collection('user_scenarios').updateOne(
            { userId },
            { $pull: { scenarios: scenarioId } }
        );
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Scenario not found in user list or already removed' });
        }
        
        res.json({ message: 'Scenario removed from user' });
    } catch (error) {
        console.error('Error removing scenario from user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a scenario completely (only for organization admins)
router.delete('/:scenarioId', authenticateToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scenarioId = parseInt(req.params.scenarioId);
        
        // Get the scenario to verify organization ownership
        const scenario = await db.collection('scenarios').findOne({ scenarioId });
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        
        // Verify the user is from the same organization that created the scenario
        const userId = req.user.userId;
        const user = await db.collection('users').findOne({ userId });
        
        if (!user || user.userType !== 'organization' || user.organizationId !== scenario.organizationId) {
            return res.status(403).json({ 
                message: 'Unauthorized: Only organization admins can delete their own scenarios' 
            });
        }
        
        // Delete the scenario
        const deleteResult = await db.collection('scenarios').deleteOne({ scenarioId });
        
        if (deleteResult.deletedCount === 0) {
            return res.status(500).json({ message: 'Failed to delete scenario' });
        }
        
        // Remove this scenario from all users who have it
        await db.collection('user_scenarios').updateMany(
            { scenarios: scenarioId },
            { $pull: { scenarios: scenarioId } }
        );
        
        res.json({ message: 'Scenario successfully deleted' });
    } catch (error) {
        console.error('Error deleting scenario:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 
