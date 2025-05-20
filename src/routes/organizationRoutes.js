const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizations = await db.collection('organizations')
      .find({})
      .toArray();
    
    res.status(200).json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizationId = parseInt(req.params.id);
    
    const organization = await db.collection('organizations')
      .findOne({ organizationId });
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.status(200).json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organization with auth (for organization dashboard)
router.get('/auth/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizationId = parseInt(req.params.id);
    
    // Verify that the user is part of the organization or an admin
    if (req.user.userType !== 'organization' && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only organization users can view organization details' 
      });
    }
    
    // For non-admins, ensure they only see their organization
    if (req.user.userType === 'organization' && req.user.organizationId !== organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your organization'
      });
    }
    
    const organization = await db.collection('organizations')
      .findOne({ organizationId });
    
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Get some basic stats for dashboard
    const applicationCount = await db.collection('applications')
      .countDocuments({ organizationId });
    
    const pendingApplicationsCount = await db.collection('applications')
      .countDocuments({ organizationId, status: 'pending' });
      
    const scenariosCount = await db.collection('scenarios')
      .countDocuments({ organizationId });
    
    res.status(200).json({
      ...organization,
      stats: {
        totalApplications: applicationCount,
        pendingApplications: pendingApplicationsCount,
        scenarios: scenariosCount
      }
    });
  } catch (error) {
    console.error('Error fetching organization with auth:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available organizations for graduates to apply to
router.get('/available/all', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.userId;
    
    // Verify that the user is a graduate
    if (req.user.userType !== 'graduate' && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only graduates can view available organizations' 
      });
    }
    
    // Get all organizations
    const organizations = await db.collection('organizations')
      .find({})
      .toArray();
    
    // Get user's existing applications
    const userApplications = await db.collection('applications')
      .find({ userId })
      .toArray();
    
    // Map organizations with application status
    const organizationsWithStatus = organizations.map(org => {
      const existingApp = userApplications.find(app => app.organizationId === org.organizationId);
      return {
        ...org,
        applicationStatus: existingApp ? existingApp.status : null,
        applicationId: existingApp ? existingApp.applicationId : null
      };
    });
    
    res.status(200).json(organizationsWithStatus);
  } catch (error) {
    console.error('Error fetching available organizations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new organization
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { organizationName, industry, contactEmail, contactPhone, address } = req.body;
    
    // Validate required fields
    if (!organizationName || !industry || !contactEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get the next organizationId
    const lastOrg = await db.collection('organizations')
      .find()
      .sort({ organizationId: -1 })
      .limit(1)
      .toArray();
    
    const nextOrgId = lastOrg.length > 0 ? lastOrg[0].organizationId + 1 : 1;
    
    // Create new organization
    const newOrganization = {
      organizationId: nextOrgId,
      organizationName,
      industry,
      contactEmail,
      contactPhone: contactPhone || null,
      address: address || null
    };
    
    const result = await db.collection('organizations').insertOne(newOrganization);
    
    res.status(201).json(newOrganization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizationId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.organizationId;
    
    const result = await db.collection('organizations').updateOne(
      { organizationId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    // Get updated organization
    const updatedOrganization = await db.collection('organizations')
      .findOne({ organizationId });
    
    res.status(200).json(updatedOrganization);
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizationId = parseInt(req.params.id);
    
    const result = await db.collection('organizations').deleteOne({ organizationId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    
    res.status(200).json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 