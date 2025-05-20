const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateTokens, verifyRefreshToken, blacklistToken } = require('../utils/jwtUtils');
const { authenticateToken } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password, firstName, lastName, userType } = req.body;
    
    // Validate required fields with detailed messages
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }
    
    if (!password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password is required' 
      });
    }
    
    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    if (!firstName) {
      return res.status(400).json({ 
        success: false, 
        message: 'First name is required' 
      });
    }
    
    if (!lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Last name is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format. Please enter a valid email address.'
      });
    }
    
    // Check if email already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Get the next userId
    const lastUser = await db.collection('users')
      .find()
      .sort({ userId: -1 })
      .limit(1)
      .toArray();
    
    const nextUserId = lastUser.length > 0 ? lastUser[0].userId + 1 : 1;
    
    // Create new user
    const newUser = {
      userId: parseInt(nextUserId),
      organizationId: 0, // Set to 0 initially for both organization and graduate users
      email,
      passwordHash,
      userType: userType || 'graduate', // Use provided user type or default to graduate
      createdAt: new Date().toISOString(),
      lastLogin: null,
      accountStatus: 'active',
      verificationStatus: Boolean(false) // Ensure boolean type
    };
    
    // Insert user
    await db.collection('users').insertOne(newUser);
    
    // Create initial profile (minimal info)
    const newProfile = {
      profileId: nextUserId, // Using same ID for simplicity
      userId: nextUserId,
      firstName,
      lastName,
      phone: null,
      bio: null,
      profilePicture: null,
      darkModePref: false,
      preferredLanguage: 'en',
      lastUpdated: new Date().toISOString()
    };
    
    // Insert profile
    await db.collection('userProfiles').insertOne(newProfile);
    
    // Generate tokens
    const tokens = generateTokens(newUser);
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      ...tokens,
      user: {
        userId: newUser.userId,
        email: newUser.email,
        firstName,
        lastName,
        isNew: true,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    // Log detailed validation errors if available
    if (error.code === 121 && error.errInfo?.details) {
      console.error('Validation details:', JSON.stringify(error.errInfo.details, null, 2));
      
      // Send a more specific error message to the client
      let clientMessage = 'Registration failed due to validation error';
      
      // Check if it's an email format error
      const validationDetails = error.errInfo.details;
      if (validationDetails.schemaRulesNotSatisfied) {
        for (const rule of validationDetails.schemaRulesNotSatisfied) {
          if (rule.propertyName === 'email') {
            clientMessage = 'Invalid email format. Please use a valid email address.';
            break;
          }
        }
      }
      
      return res.status(400).json({ 
        success: false, 
        message: clientMessage
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;
    
    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await db.collection('users').findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is not active' 
      });
    }
    
    // Get user profile
    const userProfile = await db.collection('userProfiles').findOne({ userId: user.userId });
    
    // Determine if user is new (incomplete profile)
    const isProfileComplete = userProfile && 
                            userProfile.bio !== null && 
                            userProfile.phone !== null;
    
    // Update last login
    await db.collection('users').updateOne(
      { userId: user.userId },
      { $set: { lastLogin: new Date().toISOString() } }
    );
    
    // Generate tokens
    const userWithStatus = {
      ...user,
      isNew: !isProfileComplete
    };
    const tokens = generateTokens(userWithStatus);
    
    res.status(200).json({
      success: true,
      ...tokens,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        isNew: !isProfileComplete,
        userType: user.userType,
        organizationId: user.organizationId || 0
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // User is already authenticated by middleware
    const userId = req.user.userId;
    
    // Get user from database
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne(
      { userId },
      { projection: { passwordHash: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get user profile
    const userProfile = await db.collection('userProfiles').findOne({ userId });
    
    // Determine if user is new (incomplete profile)
    const isProfileComplete = userProfile && 
                            userProfile.bio !== null && 
                            userProfile.phone !== null;
    
    res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        isNew: !isProfileComplete,
        userType: user.userType,
        organizationId: user.organizationId || 0
      }
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user from database
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ userId: decoded.userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate new tokens
    const tokens = generateTokens(user);
    
    res.status(200).json({
      success: true,
      ...tokens
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // Blacklist the current token
    blacklistToken(req.token);
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 