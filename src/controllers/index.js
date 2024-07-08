/**
 * Read all the files in the current directory
 * and export them as controllers. Each controller file
 * should have a default export that is a function
 */
const fs = require("fs");
const path = require("path");

// Object to store all the controllers
const controllers = {};

// Loop through each file in the directory
fs.readdirSync(__dirname).forEach((file) => {
  // If the file is not the index.js file and ends with .js
  if (file !== "index.js" && file.endsWith(".js")) {
    // Require the file and get the default export
    const controller = require(path.join(__dirname, file));
    // Get the name of the controller by removing the .js extension
    const controllerName = path.basename(file, ".js");
    // Add the controller to the controllers object with the name as the key
    controllers[controllerName] = controller;
  }
});

// Export the controllers object
module.exports = controllers;
