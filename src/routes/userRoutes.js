const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

// Get all users
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const users = await db.collection('users')
      .find({})
      .project({ passwordHash: 0 }) // Don't return password hashes
      .toArray();
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = parseInt(req.params.id);
    
    const user = await db.collection('users')
      .findOne({ userId }, { projection: { passwordHash: 0 } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, passwordHash, userType, organizationId } = req.body;
    
    // Validate required fields
    if (!email || !passwordHash || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    
    // Get the next userId (you might want to implement a better ID generation strategy)
    const lastUser = await db.collection('users')
      .find()
      .sort({ userId: -1 })
      .limit(1)
      .toArray();
    
    const nextUserId = lastUser.length > 0 ? lastUser[0].userId + 1 : 1;
    
    // Create new user object
    const newUser = {
      userId: nextUserId,
      organizationId: organizationId || null,
      email,
      passwordHash,
      userType,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      accountStatus: 'active',
      verificationStatus: false
    };
    
    const result = await db.collection('users').insertOne(newUser);
    
    // Return the created user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = parseInt(req.params.id);
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.passwordHash;
    delete updateData.createdAt;
    
    // Add lastUpdated timestamp
    updateData.lastUpdated = new Date().toISOString();
    
    const result = await db.collection('users').updateOne(
      { userId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get updated user
    const updatedUser = await db.collection('users')
      .findOne({ userId }, { projection: { passwordHash: 0 } });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = parseInt(req.params.id);
    
    const result = await db.collection('users').deleteOne({ userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 