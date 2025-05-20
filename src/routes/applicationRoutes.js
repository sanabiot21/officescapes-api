const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * Get all applications for an organization (organization only)
 */
router.get('/organization/:organizationId', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const organizationId = parseInt(req.params.organizationId);
    
    // Verify that the user is part of the organization or an admin
    if (req.user.userType !== 'organization' && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only organization users can view their applications' 
      });
    }
    
    // For non-admins, ensure they only see their organization's applications
    if (req.user.userType === 'organization' && req.user.organizationId !== organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view applications for your organization'
      });
    }
    
    // Get applications from the database
    const applications = await db.collection('applications')
      .find({ organizationId })
      .toArray();
    
    // Get user info for each application
    const applicationsWithUserInfo = await Promise.all(applications.map(async (app) => {
      const user = await db.collection('users').findOne({ userId: app.userId });
      const userProfile = await db.collection('userProfiles').findOne({ userId: app.userId });
      
      return {
        ...app,
        applicantName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : null,
        applicantEmail: user ? user.email : null
      };
    }));
    
    res.status(200).json(applicationsWithUserInfo);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * Get all applications for a user (graduate only)
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = parseInt(req.params.userId);
    
    // Verify that the requesting user is the same as the user ID or an admin
    if (req.user.userId !== userId && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: You can only view your own applications' 
      });
    }
    
    // Get applications from the database
    const applications = await db.collection('applications')
      .find({ userId })
      .toArray();
    
    // Get organization info for each application
    const applicationsWithOrgInfo = await Promise.all(applications.map(async (app) => {
      const organization = await db.collection('organizations').findOne({ organizationId: app.organizationId });
      
      return {
        ...app,
        organizationName: organization ? organization.name : null
      };
    }));
    
    res.status(200).json(applicationsWithOrgInfo);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * Create a new application
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { organizationId, notes, position, skills, contactPhone, applicationDate } = req.body;
    const userId = req.user.userId;
    
    // Verify that the user is a graduate
    if (req.user.userType !== 'graduate') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only graduates can create applications' 
      });
    }
    
    // Check if the organization exists
    const organization = await db.collection('organizations').findOne({ 
      organizationId: parseInt(organizationId) 
    });
    
    if (!organization) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }
    
    // Check if the user already has a pending application with this organization
    const existingApplication = await db.collection('applications').findOne({
      userId,
      organizationId: parseInt(organizationId),
      status: 'pending'
    });
    
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending application for this organization'
      });
    }
    
    // Get the next application ID
    const lastApplication = await db.collection('applications')
      .find()
      .sort({ applicationId: -1 })
      .limit(1)
      .toArray();
    
    const nextApplicationId = lastApplication.length > 0 ? lastApplication[0].applicationId + 1 : 1;
    
    // Create new application
    const newApplication = {
      applicationId: nextApplicationId,
      userId: parseInt(userId),
      organizationId: parseInt(organizationId),
      status: 'pending',
      applicationDate: applicationDate || new Date().toISOString(),
      responseDate: null,
      notes: notes || null,
      position: position || null,
      skills: skills || null,
      contactPhone: contactPhone || null
    };
    
    // Insert application
    await db.collection('applications').insertOne(newApplication);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: newApplication
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * Approve an application (organization only)
 */
router.put('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const applicationId = parseInt(req.params.id);
    
    // Find the application
    const application = await db.collection('applications').findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    // Verify that the user is part of the organization or an admin
    if (req.user.userType !== 'organization' && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only organizations can approve applications' 
      });
    }
    
    // For organization users, make sure they only approve applications for their organization
    if (req.user.userType === 'organization' && req.user.organizationId !== application.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only approve applications for your organization'
      });
    }
    
    // Update application status
    await db.collection('applications').updateOne(
      { applicationId },
      { 
        $set: { 
          status: 'approved',
          responseDate: new Date().toISOString()
        } 
      }
    );
    
    // Update the user's organizationId
    await db.collection('users').updateOne(
      { userId: application.userId },
      { $set: { organizationId: application.organizationId } }
    );
    
    // TODO: Notify the user
    
    res.status(200).json({
      success: true,
      message: 'Application approved successfully'
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

/**
 * Reject an application (organization only)
 */
router.put('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const applicationId = parseInt(req.params.id);
    const { notes } = req.body || {};
    
    // Find the application
    const application = await db.collection('applications').findOne({ applicationId });
    
    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }
    
    // Verify that the user is part of the organization or an admin
    if (req.user.userType !== 'organization' && req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Only organizations can reject applications' 
      });
    }
    
    // For organization users, make sure they only reject applications for their organization
    if (req.user.userType === 'organization' && req.user.organizationId !== application.organizationId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only reject applications for your organization'
      });
    }
    
    // Update application status
    await db.collection('applications').updateOne(
      { applicationId },
      { 
        $set: { 
          status: 'rejected',
          responseDate: new Date().toISOString(),
          notes: notes || application.notes
        } 
      }
    );
    
    // TODO: Notify the user
    
    res.status(200).json({
      success: true,
      message: 'Application rejected successfully'
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router; 