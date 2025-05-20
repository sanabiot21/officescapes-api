const express = require('express');
const router = express.Router();

// Get all user profiles
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userProfiles = await db.collection('userProfiles')
      .find({})
      .toArray();
    
    res.status(200).json(userProfiles);
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const profileId = parseInt(req.params.id);
    
    const userProfile = await db.collection('userProfiles')
      .findOne({ profileId });
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = parseInt(req.params.userId);
    
    const userProfile = await db.collection('userProfiles')
      .findOne({ userId });
    
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile by userId:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user profile
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { userId, firstName, lastName, phone, bio, profilePicture, darkModePref, preferredLanguage } = req.body;
    
    // Validate required fields
    if (!userId || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if profile for this user already exists
    const existingProfile = await db.collection('userProfiles').findOne({ userId });
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists for this user' });
    }
    
    // Get the next profileId
    const lastProfile = await db.collection('userProfiles')
      .find()
      .sort({ profileId: -1 })
      .limit(1)
      .toArray();
    
    const nextProfileId = lastProfile.length > 0 ? lastProfile[0].profileId + 1 : 1;
    
    // Create new user profile
    const newUserProfile = {
      profileId: nextProfileId,
      userId,
      firstName,
      lastName,
      phone: phone || null,
      bio: bio || null,
      profilePicture: profilePicture || null,
      darkModePref: darkModePref || false,
      preferredLanguage: preferredLanguage || null,
      lastUpdated: new Date().toISOString()
    };
    
    const result = await db.collection('userProfiles').insertOne(newUserProfile);
    
    res.status(201).json(newUserProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const profileId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.profileId;
    delete updateData.userId;
    
    // Add lastUpdated timestamp
    updateData.lastUpdated = new Date().toISOString();
    
    const result = await db.collection('userProfiles').updateOne(
      { profileId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    // Get updated profile
    const updatedProfile = await db.collection('userProfiles')
      .findOne({ profileId });
    
    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user profile
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const profileId = parseInt(req.params.id);
    
    const result = await db.collection('userProfiles').deleteOne({ profileId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    
    res.status(200).json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 