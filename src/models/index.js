// Importing necessary modules
const mongoose = require("mongoose");
const { mongoConnectionString } = require("../../config");

// Connecting to MongoDB database
// TODO: Remove connection string 
mongoose
  .connect(
    mongoConnectionString ||
      "mongodb+srv://sohaibengineerdev:sohaibengineerdev@cluster0.caqgjq3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((res) => {
    // Logging when the connection is successful
    console.log("mongodb connected");
  })
  .catch((error) => {
    // Logging when there is an error in connecting to the database
    console.log("Cannot Connect To Mongo Database!", error);
  });

// Importing all models using fs
const fs = require("fs");
const path = require("path");

let models = {};

// Loop through each file in the directory
fs.readdirSync(__dirname).forEach((file) => {
  // If the file is not the index.js file and ends with .js
  if (file !== "index.js" && file.endsWith(".js")) {
    // Require the file and get the default export
    const model = require(path.join(__dirname, file));

    // Get the name of the model by removing the .js extension
    const modelName = path.basename(file, ".js");

    // Add the model to the models object with the name as the key
    models[modelName] = model;
  }
});

// Export the models object
module.exports = models;
