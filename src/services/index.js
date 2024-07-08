/**
 * Read all the files in the current directory
 * and export them as services. Each controller file
 * should have a default export that is a function
 */
const fs = require("fs");
const path = require("path");

// Object to store all the controllers
const services = {};

// Loop through each file in the directory
fs.readdirSync(__dirname).forEach((file) => {
  // If the file is not the index.js file and ends with .js
  if (file !== "index.js" && file.endsWith(".js")) {
    // Require the file and get the default export
    const service = require(path.join(__dirname, file));
    // Get the name of the controller by removing the .js extension
    const serviceName = path.basename(file, ".js");
    // Add the controller to the controllers object with the name as the key
    services[serviceName] = service;
  }
});

// Export the services object
module.exports = services;
