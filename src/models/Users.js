const mongoose = require("mongoose");

// Define the schema for the user model
const userSchema = new mongoose.Schema(
  {
    // The email of the user
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // The password of the user
    password: {
      type: String,
    },
    // The field to set the verified
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Google Id
    googleId: {
      type: String,
    },
    // Google Acess Token
    googleAccessToken: {
      type: String,
    },
    // Facebook Id
    facebookId: {
      type: String,
    },
    // Facebook Acess Token
    facebookAccessToken: {
      type: String,
    },
    // LinkedIn Id
    linkedinId: {
      type: String,
    },
    // LinkedIn Acess Token
    linkedinAccessToken: {
      type: String,
    },
  },
  {
    // Add timestamps to the model
    timestamps: true,
  }
);

// Create a model based on the schema
const Users = mongoose.model("user", userSchema);

// Export the model
module.exports = Users;
