const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");
const campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
  //   res.send("Hello From Yelp Camp");
});

//not needed

// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My Home",
//     description: "Palam",
//   });
//   await camp.save();
//   res.send(camp);
// });

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
