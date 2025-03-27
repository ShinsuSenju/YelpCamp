const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

// Render Register Form
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Handle Register Form Submission
router.post(
  "/login",
  storeReturnTo, // Middleware to store the returnTo URL
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const redirectUrl = res.locals.returnTo || "/campgrounds"; // Redirect to saved URL
    res.redirect(redirectUrl);
  }
);

// Render Login Form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Handle Login Form Submission
router.post(
  "/login",
  storeReturnTo, // Middleware to store the returnTo URL
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
  }
);

// Handle Logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
