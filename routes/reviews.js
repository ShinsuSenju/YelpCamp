const express = require("express");
const router = express.Router({ mergeParams: true }); // Merge params to access `id` from parent route
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Route to create a new review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found!");
      return res.redirect("/campgrounds");
    }
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from campground
    await Review.findByIdAndDelete(reviewId); // Delete the review
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
