const jwt = require('jsonwebtoken');

// Environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '1h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// In-memory token blacklist (in production, use Redis or similar)
const tokenBlacklist = new Set();

/**
 * Generate access token for a user
 * @param {Object} user User data to include in token
 * @returns {String} JWT access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      isNew: user.isNew || false,
      userType: user.userType || 'graduate',
      organizationId: user.organizationId || 0
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate refresh token for a user
 * @param {Object} user User data to include in token
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.userId,
      tokenType: 'refresh'
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify access token
 * @param {String} token JWT token to verify
 * @returns {Object} Decoded token data
 */
const verifyAccessToken = (token) => {
  if (tokenBlacklist.has(token)) {
    throw new Error('Token has been revoked');
  }
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

/**
 * Verify refresh token
 * @param {String} token Refresh token to verify
 * @returns {Object} Decoded token data
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

/**
 * Add a token to the blacklist (for logout)
 * @param {String} token Token to blacklist
 */
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user User data
 * @returns {Object} Object containing both tokens
 */
const generateTokens = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: parseInt(ACCESS_TOKEN_EXPIRY) || 3600
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  blacklistToken,
  generateTokens
}; 