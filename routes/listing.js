const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const { index, renderNewForm, showListing, createListing, updateListing, deleteListing, renderEditForm } = require("../controllers/listing.js");

//Index Route
router.get("/", index);

//New Route
router.get("/new", isLoggedIn, renderNewForm );

//Show Route
router.get(
  "/:id",
  wrapAsync(showListing)
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(renderEditForm)
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(updateListing)
);

//Delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(deleteListing)
);

module.exports = router;