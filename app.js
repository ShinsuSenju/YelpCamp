const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");

// Importing Routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const app = express();

// Database Connection
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Connection error:", err));

// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Home Route
app.get("/", (req, res) => {
  res.render("home");
});

// Routes
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// 404 Error Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// General Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { err });
});

// Start Server
app.listen(3000, () => console.log("Listening on port 3000"));
