const { verifyAccessToken } = require('../utils/jwtUtils');

/**
 * Middleware to authenticate user with JWT token
 * Expects token in Authorization header as 'Bearer [token]'
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Add user info to request
    req.user = decoded;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    // Specific error for expired tokens to help client handle token refresh
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        expired: true
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = { authenticateToken }; 