const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "67e0310e171b3b17c16c82f1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio voluptatum aperiam deserunt, vero quidem veritatis velit, porro accusantium a unde incidunt atque voluptates aliquid explicabo vitae, corporis tempore adipisci at!",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/dqoevvmpp/image/upload/v1743830389/YelpCamp/tou6ho1uecsmgytkvg0g.jpg",
          filename: "YelpCamp/tou6ho1uecsmgytkvg0g",
        },
        {
          url: "https://res.cloudinary.com/dqoevvmpp/image/upload/v1743830390/YelpCamp/fxzgehvcezgdwg7thvdv.jpg",
          filename: "YelpCamp/fxzgehvcezgdwg7thvdv",
        },
        {
          url: "https://res.cloudinary.com/dqoevvmpp/image/upload/v1743830389/YelpCamp/jt224am77p2r1dgl1yxg.jpg",
          filename: "YelpCamp/jt224am77p2r1dgl1yxg",
        },
        {
          url: "https://res.cloudinary.com/dqoevvmpp/image/upload/v1743830390/YelpCamp/t29f4wi8r54fjzmyhxgj.jpg",
          filename: "YelpCamp/t29f4wi8r54fjzmyhxgj",
        },
        {
          url: "https://res.cloudinary.com/dqoevvmpp/image/upload/v1743830390/YelpCamp/lllrbzg3b9aqhffpamje.jpg",
          filename: "YelpCamp/lllrbzg3b9aqhffpamje",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
