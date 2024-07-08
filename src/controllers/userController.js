// Import the getAllData function from the users service
const {
  backendUrl,
  frontendUrl,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
} = require("../../config");
const { Users } = require("../models");

// Import the success and error functions from the apiResponse utils
const { success, error } = require("../utils/apiResponse");
const { generateToken, verifyToken, decodeToken } = require("../utils/jwt");
const sendMail = require("../utils/mailer");
const { hashPassword, comparePassword } = require("../utils/password");
const {
  findOneByQuery,
  updateByQuery,
  createData,
  updateById,
  findOneById,
} = require("../services/dbService");
const { removeKeyFromObject } = require("../utils/common");
const axios = require("axios");
const axiosRetry = require("axios-retry").default;

axiosRetry(axios, { retries: 5, retryDelay: axiosRetry.exponentialDelay });

/**
 * Generate User Token
 *
 * This function generates a JWT token with the user's id and email
 * @param {object} user - The user object
 * @returns {string} - The generated token
 */
const generateUserToken = (user) => {
  return generateToken({ id: user._id, email: user.email });
};

/**
 * Register New User
 *
 * Method to Register a new user in the database and send the email to user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object- redirects to login page
 * @throws {Error} - If the email or password is missing
 * @throws {Error} - If the email is already registered
 * @throws {Error} - If there is an error while registering the user
 */
exports.registerUser = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if the email is already registered
    const userFinded = await findOneByQuery({ email }, Users);
    if (userFinded) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check the passoerd length and it should be at least 6
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password should be at least 8 characters" });
    }

    // Encrypte the password
    const encryptedPassword = await hashPassword(password);

    const data = await createData(
      {
        email,
        password: encryptedPassword,
      },
      Users
    );

    // Exculde the password while sending the data
    const user = removeKeyFromObject(data.toObject(), "password");

    // Generate a JWT token
    const token = generateUserToken(user);

    // send email to user for verification
    await sendMail(
      email,
      "Verify your account",
      `Click the link below to verify your account: `,
      "src/templates/singup.html",
      {
        link: backendUrl + "/api/user/verify-token?token=" + token,
      }
    );

    // Call the success function with the data object and status code 200
    success({ message: "Verification link sent to your email" }, 200)(req, res);
  } catch (e) {
    // Call the error function with the error object and error message
    error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Verify Auth Token
 *
 * Method to Verify the authentication token and update the user in the database
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {object} - The response object - redirects to login page
 * @throws {Error} - If the token is not provided
 * @throws {Error} - If the token is expired or invalid
 * @throws {Error} - If there is an error while verifying the token
 */
exports.verifyAuthToken = async (req, res) => {
  try {
    // Get the token from the request query
    const { token } = req.query;

    // If the token is not provided, return an error
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify the token
    const isTokenVerified = await verifyToken(token);

    // If the token is not verified, return an error
    if (!isTokenVerified) {
      error(null, "Token Expired or Invalid", 400)(req, res);
    }

    // Decode the token and get the user data
    const decodedTokenData = await decodeToken(token);

    // Update the user in the database that it is verified
    await updateByQuery(
      { _id: decodedTokenData.id },
      { isVerified: true },
      Users
    );

    // Redirect the user to the login page with a success message
    res.redirect(frontendUrl + "/login" + "?emailVerified=true");
  } catch (e) {
    // If there is an error, return an error response
    error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Fetch User Token Data
 *
 * This function fetches the user data from the token and returns it.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with the user data
 * @throws {Error} - If the token is expired or invalid
 * @throws {Error} - If there is an error while verifying the token
 */
exports.fetchUserTokenData = async (req, res) => {
  try {
    const userData = await findOneById(req.user.id, Users);
    // Return the user data in the response
    success(
      {
        user: userDataToSend(userData),
        token: req.user.token,
      },
      200
    )(req, res);
  } catch (e) {
    // If there is an error, return an error response
    error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * userDataToSend
 *
 * This function takes a user object and returns a user data object that contains
 * the user's ID, email, and verification status.
 *
 * @param {Object} user - The user object
 * @returns {Object} - The user data object
 */
const userDataToSend = (user) => {
  // Return the user data object
  return {
    id: user._id, // The user's ID
    email: user.email, // The user's email
    isVerified: user.isVerified, // The user's verification status
  };
};
/**
 * Login User
 *
 * Authenticates a user by their email and password and returns a JSON Web Token (JWT).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object containing the JWT token.
 * @throws {Error} - If the email or password is missing.
 * @throws {Error} - If the user is not found in the database.
 * @throws {Error} - If the password does not match.
 * @throws {Error} - If there is an error during the authentication process.
 */
exports.loginUser = async (req, res) => {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // If email or password is missing, return an error response
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        error: { message: "Email and password are required" },
      });
    }

    // Get the user from the database by their email
    const user = await findOneByQuery({ email }, Users);

    // If user is not found, return an error response
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: { message: "Invalid Credentials" } });
    }

    // Check if the provided password matches the user's password
    const isPasswordValid = await comparePassword(password, user.password);

    // If password is invalid, return an error response
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: { message: "Invalid Credentials" } });
    }

    // Check if the user is verified or not
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: {
          message:
            "Email verification required. Please check your inbox for the verification email and click the link to confirm your account.",
        },
      });
    }

    // Generate a JSON Web Token (JWT) with the user's ID and email
    const token = generateUserToken(user);

    // Return a success response with the token, a message, and the user object
    success(
      {
        token,
        user: userDataToSend(user),
        message: "Login successful",
      },
      200
    )(req, res);
  } catch (e) {
    // If an error occurs, return an error response with details
    error(e, "Something went wrong", 500)(req, res);
  }
};

/**
 * Handle Google Sign-In
 *
 * This function handles the Google Sign-In and creates a new user in the database
 * or updates the existing user with the Google ID and Access Token
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with success, token
 * @throws {Error} - If the user token is missing or invalid
 * @throws {Error} - If there is an error while updating the user in the database
 */
exports.handleGoogleLogin = async (request, response) => {
  try {
    const userData = request.user;
    const { accessToken: userToken } = userData;
    // Check if the user token is provided
    if (!userToken) {
      return response.status(400).send({ error: "User Token is required" });
    }

    // Extract user information from the decoded token
    // Using information as per this link: https://developers.google.com/identity/gsi/web/reference/js-reference
    const userGoogleId = userData["sub"]; // The unique ID of the user's Google Account
    const userGoogleEmail = userData["email"];

    // Check if a user already exists based on the email
    let user = await findOneByQuery({ email: userGoogleEmail }, Users);

    if (!user) {
      // Create a new user
      user = await createData(
        {
          email: userGoogleEmail,
          googleId: userGoogleId,
          googleAccessToken: userToken,
          isVerified: true, // verified user as comming after google login
        },
        Users
      );
      // Send a welcome email to the new user
    } else if (!user["googleId"]) {
      /**
       * Update the user's Google ID and Access Token when the user's email is already saved through other platforms
       * such as Twitter, Facebook, or direct email.
       */
      user = await updateById(
        user._id,
        {
          googleId: userGoogleId,
          googleAccessToken: userToken,
          isVerified: true,
        },
        Users
      );
    }

    // Generate a JWT token
    const token = generateUserToken(user);
    // Redirect to the frontend URL with the token as a query parameter
    return response.redirect(frontendUrl + "?token=" + token);
  } catch (error) {
    return response.redirect(frontendUrl + "/login?error=" + error.message);
  }
};

/**
 * Handle LinkedIn login and return user information and access token
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with user information and access token
 * @throws {Error} - If there is an error while requesting the access token or user information
 */
exports.handleLinkedinLogin = async (req, res) => {
  // Extract authorization code from query parameters
  const { code } = req.query;

  const redirectUri = backendUrl + "/api/auth/linkedin/callback";

  try {
    // Request access token from LinkedIn using the authorization code
    // Documentation: https://developer.linkedin.com/docs/build/signin-with-linkedin
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: redirectUri,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Extract access token from the response
    const { access_token } = tokenResponse.data;

    // Request user information from LinkedIn API
    // Documentation: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2#api-request-to-retreive-member-details
    const userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // Extract user Dataa from the response
    const userData = userInfoResponse.data;

    const linkedinId = userData["sub"];
    const userEmail = userData["email"];

    // Check if a user already exists based on the email
    let user = await findOneByQuery({ email: userEmail }, Users);

    if (!user) {
      // Create a new user
      user = await createData(
        {
          email: userEmail,
          linkedinId: linkedinId,
          linkedinAccessToken: access_token,
          isVerified: true, // verified user as comming after linkedin login
        },
        Users
      );
    } else if (!user["linkedinId"]) {
      /**
       * Update the user's LinkedIn ID when the user's email is already saved through other platforms
       * such as Twitter, Facebook, or direct email.
       */
      user = await updateById(
        user.id,
        {
          linkedinId: linkedinId,
          linkedinAccessToken: access_token,
          isVerified: true,
        },
        Users
      );
    }

    // Generate a JWT token
    const token = generateUserToken(user);

    // Redirect to the frontend URL with the token as a query parameter
    return res.redirect(frontendUrl + "?token=" + token);
  } catch (error) {
    // Handle errors by redirecting to the login page with an error message
    return res.redirect(frontendUrl + "/login?error=" + error?.message);
  }
};

/**
 *Handle Facebook Login
 *
 * Method to Handles the Facebook login and creates a new user or updates an existing user
 * based on the user's email.
 * @param {Object} request - The request object
 * @param {Object} response - The response object
 * @returns {Object} - The response object with a JWT token
 * @throws {Error} - If the user token is missing or invalid
 */
exports.handleFacebookLogin = async (request, response) => {
  try {
    // Extract user data from the request object
    const userData = request.user;
    const { accessToken: userToken } = userData;

    // Check if the user token is provided
    if (!userToken) {
      return response.status(400).send({ error: "User Token is required" });
    }

    // Extract user information
    const userFacebookId = userData["id"]; // The unique ID of the user's Facebook Account
    const userEmail = userData["emails"][0]?.value;

    // Check if a user already exists based on the email
    let user = await findOneByQuery({ email: userEmail }, Users);

    if (!user) {
      // Create a new user
      user = await createData(
        {
          email: userEmail,
          facebookId: userFacebookId,
          facebookAccessToken: userToken,
          isVerified: true, // Verified user as coming after Facebook login
        },
        Users
      );
    } else if (!user["facebookId"]) {
      /**
       * Update the user's Facebook ID and Access Token when the user's email is already saved through other platforms
       * such as Twitter, Facebook, or direct email.
       */
      user = await updateById(
        user._id,
        {
          facebookId: userFacebookId,
          facebookAccessToken: userToken,
          isVerified: true,
        },
        Users
      );
    }

    const token = generateUserToken(user);
    // Redirect to the frontend URL with the token as a query parameter
    return response.redirect(frontendUrl + "?token=" + token);
  } catch (error) {
    // Handle errors by redirecting to the login page with an error message
    return response.redirect(frontendUrl + "/login?error=" + error?.message);
  }
};
