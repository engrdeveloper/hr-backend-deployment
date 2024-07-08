// Import the JWT secret from the configuration file
const { jwtSecret } = require("../../config");

// Import the JSON Web Token module
const jwt = require("jsonwebtoken");

/**
 * Function to generate a JWT token
 *
 * @param {Object} payload
 * @returns {string} - The generated JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
};

/**
 * Verify Token
 *
 * Function to verify a JWT token
 * @param {string} token - The JWT token to be verified
 * @returns {Object|string} - The decoded payload if the verification is successful, or an error message if the verification fails
 */
const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

/**
 * Decode Token
 *
 * Function to decode a JWT token
 * @param {string} token - The JWT token to be decoded
 * @returns {Object|string} - The decoded payload if the decoding is successful, or an error message if the decoding fails
 */
const decodeToken = (token) => {
  return jwt.decode(token, jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
};
