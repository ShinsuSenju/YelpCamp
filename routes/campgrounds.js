const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const campgrounds = require("../controllers/campgrounds.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

router
  .route("/")
  .get(catchAsync(campgrounds.index)) // Get all campgrounds
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  ); // Create a new campground

router.get("/new", isLoggedIn, campgrounds.renderNewForm); // Render form to create a new campground

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) // Get a specific campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  ) // Update a campground
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // Delete a campground

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,

  catchAsync(campgrounds.renderEditCampground)
); // Render form to edit a campground

module.exports = router;
