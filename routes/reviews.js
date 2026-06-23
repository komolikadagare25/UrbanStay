const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
//models
const Review = require("../models/review.js");
const Listing = require("../models/listing");
// middleware
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
//controller
const reviewController = require("../controllers/review.js");

// post route
router.post("", isLoggedIn, validateReview, wrapAsync(reviewController.newReview));

//delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router