const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/review.js");

//Review
//post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Review Route
router.delete(
  "/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview));

module.exports = router;