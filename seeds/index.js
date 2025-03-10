const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection erro:"));
db.once("open", () => {
  console.log("Database connected");
});
