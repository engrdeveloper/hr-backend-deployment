// Load environment variables from .env file
require("dotenv").config();

// Export configuration object
module.exports = {
  // Port number the server should listen on
  // Defaults to 4000 if not specified in .env file
  PORT: process.env.PORT || 4000,
  backendUrl: process.env.NEXT_PUBLIC_API_URL,
  frontendUrl: process.env.NEXT_PUBLIC_WEB_APP_URL,
  mailConfigurations: {
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASS,
  },
  jwtSecret: process.env.JWT_SECRET,
  mongoDB: {
    // Hostname of the MongoDB server
    dbHostName: process.env.DB_HOSTNAME,
    // Name of the database
    dbName: process.env.DB_NAME,
  },
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  // Google Client Id and Client Secret
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  // Linkedin Client Id and Client Secret
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  // Facebook Client Id and Client Secret
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
};
