const joi = require("joi");
module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      title: joi.string().required(),
      price: joi.number().required().min(0),
      //image: joi.string().required(),
      location: joi.string().required(),
      description: joi.string().required(),
    })
    .required(),
  deleteImages: joi.array(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().integer().required().min(1).max(5),
      body: joi.string().required(),
    })
    .required(),
});
