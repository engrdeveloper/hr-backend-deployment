const fs = require("fs");
const express = require("express");
const router = express.Router();

const { PORT } = require("../../config");
const path = require("path");
const routesPath = `${__dirname}/`;

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((dir) => {
  return dir !== "index.js"
    ? router.use(`/${path.basename(dir, ".js")}`, require(`./${dir}`))
    : "";
});

// Handle default route
router.get("/", (req, res) => {
  res.json({
    success: true,
    data: { message: `I'm Running on port: ${PORT}` },
  });
});

// Handle 404 error
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "URL NOT FOUND",
    },
  });
});

module.exports = router;
