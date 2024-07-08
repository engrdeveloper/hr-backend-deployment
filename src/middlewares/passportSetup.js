// Set up Passport.js with Google OAuth2 strategy

const passport = require("passport");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  backendUrl,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = require("../../config");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new GoogleStrategy(
    {
      // Client ID for Google OAuth2
      clientID: GOOGLE_CLIENT_ID,
      // Client secret for Google OAuth2
      clientSecret: GOOGLE_CLIENT_SECRET,
      // Callback URL for Google OAuth2
      callbackURL: backendUrl + "/api/auth/google/callback",
      // Pass the request object to the callback
      passReqToCallback: true,
    },
    // Callback function after successful authentication
    (req, accessToken, refreshToken, profile, done) => {
      // Add the access token to the user profile
      profile.accessToken = accessToken;
      // Return the user profile
      return done(null, profile);
    }
  )
);

// Define Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      // Client ID for Facebook Auth
      clientID: FACEBOOK_APP_ID,
      // APP secret for Facebook Auth
      clientSecret: FACEBOOK_APP_SECRET,
      // Callback URL for Facebook
      callbackURL: backendUrl + "/api/auth/facebook/callback",

      scope: ["public_profile", "email"],
      profileFields: ["id", "displayName", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      done(null, profile);
    }
  )
);

// Serialize the user object
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user object
passport.deserializeUser((user, done) => {
  done(null, user);
});
