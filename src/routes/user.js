const router = require("express").Router();
const {
  registerUser,
  verifyAuthToken,
  loginUser,
  fetchUserTokenData,
} = require("../controllers/userController");
const { verifyTokenFromHeaders } = require("../middlewares/authentication");

// route to register
router.post("/register", registerUser);

// route to verify token while signing up
router.get("/verify-token", verifyAuthToken);

// route to get the user from the token
router.get("/fetch-token-data", verifyTokenFromHeaders, fetchUserTokenData);

// route to login the user
router.post("/login", loginUser);

module.exports = router;
