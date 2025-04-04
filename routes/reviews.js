const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Route to create a new review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
