// Import required modules and dependencies
const passport = require("passport");
const {
  handleGoogleLogin,
  handleLinkedinLogin,
  handleFacebookLogin,
} = require("../controllers/userController");
const { frontendUrl, LINKEDIN_CLIENT_ID, backendUrl } = require("../../config");
const crypto = require("crypto");
const router = require("express").Router();

// Require the passport setup middleware
require("../middlewares/passportSetup");

// Route for starting the Google authentication process
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for handling the response from Google after authentication
router.get(
  "/google/callback",
  passport.authenticate("google"),
  async (req, res) => {
    // Handle the Google login response
    await handleGoogleLogin(req, res);
  }
);

// Route for starting the Facebook authentication process
router.get("/facebook", passport.authenticate("facebook"));

// Callback route for handling the response from Facebook after authentication
router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  async (req, res) => {
    // Handle the Facebook login response
    await handleFacebookLogin(req, res);
  }
);

// Route for the linkedin authentication
router.get("/linkedin", async (req, res) => {
  const redirectUri = backendUrl + "/api/auth/linkedin/callback";
  const scope = "openid email profile w_member_social";
  const state = crypto.randomBytes(16).toString("hex");

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  res.redirect(authorizationUrl);
});

// Route for linkedin callback
router.get("/linkedin/callback", async (req, res) => {
  // Handle the Linkedin login response and generate a token
  const processingResponse = await handleLinkedinLogin(req, res);
  if (processingResponse && processingResponse?.token) {
    // Redirect to the frontend URL with the token as a query parameter
    res.redirect(frontendUrl + "?token=" + processingResponse.token);
  }
});

// Export the router
module.exports = router;
