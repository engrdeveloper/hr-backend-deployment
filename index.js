// Import the necessary modules
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { PORT } = require("./config/index");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");

const app = express();

// Load environment variables from .env file
dotenv.config({});

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Session System
app.use(
  session({
    secret: "your_secret_key", // Replace with a strong, random secret key
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: false }, // Set to true if using HTTPS in production
  })
);

// Enable logging with morgan
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(bodyParser.json());

// importing all routes
app.use("/api", require("./src/routes"));

// Start the server and listen on the specified PORT
app.listen(PORT, (err) => {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
