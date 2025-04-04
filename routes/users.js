const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegister) // Show Register Form
  .post(catchAsync(users.register)); // Register A User

router
  .route("/login")
  .get(users.renderLogin) // Show Login Form
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  ); // Login

// Handle Logout
router.get("/logout", users.logout);

module.exports = router;
