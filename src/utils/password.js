const bcrypt = require("bcrypt");

/**
 * Hash Password
 *
 * Function to hash a password
 * @param {string} password
 * @returns - The hashed password
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // You can change this value to adjust the complexity
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

/**
 * Compare Password
 *
 * Function to compare a password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns - true if the passwords match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
