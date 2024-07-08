const { error } = require("../utils/apiResponse");
const { verifyToken, decodeToken } = require("../utils/jwt");

/**
 * Verify Token From Headers
 *
 * Middleware to verify the token coming in the headers in the authorization bearer
 * @param {req} req - The request object
 * @param {res} res - The response object
 * @param {next} next - The next middleware
 * @returns - The next middleware
 * @throws - If there is an error
 */
const verifyTokenFromHeaders = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers["authorization"]?.split(" ")[1];

    // If the token is not provided, return an error
    if (!token) {
      return res.status(401).json({ error: "Token is required" });
    }

    // Verify the token
    const isTokenVerified = await verifyToken(token);

    // If the token is not verified, return an error
    if (!isTokenVerified) {
      return res.status(401).json({ error: "Token Expired or Invalid" });
    }

    // Decode the token and get the user data
    const decodedTokenData = await decodeToken(token);

    // Add the user data to the request object
    req.user = decodedTokenData;
    req.user.token = token;

    // Call the next middleware or route handler
    next();
  } catch (e) {
    // If there is an error, return an error response
    error(e, "Something went wrong", 500)(req, res);
  }
};

module.exports = {
  verifyTokenFromHeaders,
};
