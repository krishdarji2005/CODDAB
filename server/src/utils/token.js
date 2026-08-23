// src/utils/token.js – JWT creation and verification utilities
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Create a signed JWT for the given payload.
 * Token expires in 7 days.
 *
 * @param {Object} payload - Data to encode (e.g. { id: user._id })
 * @returns {string} Signed JWT string.
 */
export function createUserToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify and decode a JWT.
 * Returns the decoded payload if valid, or null if invalid/expired.
 *
 * @param {string} token - The JWT to verify.
 * @returns {Object|null} Decoded payload or null.
 */
export function validateUserToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
