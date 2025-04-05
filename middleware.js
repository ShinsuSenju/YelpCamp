const { campgroundSchema, reviewSchema } = require("./schema.js");
const Campground = require("./models/campground");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.returnTo = req.originalUrl; // Store intended URL only for GET requests
    }
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// Middleware to store the returnTo URL for redirection after login
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    delete req.session.returnTo; // Ensure it's cleared after use
  }
  next();
};

// Middleware to validate campground data
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400); // Throw an ExpressError with a 400 status code
  }
  next();
};

// Middleware to check if the user is the author of the campground
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/campgrounds/${id}`);
  }

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};
