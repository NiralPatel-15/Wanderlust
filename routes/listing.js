const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  updateListing,
  destroyListing,
  renderEditForm,
} = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });

// Index Route
router.route("/").get(index).post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(createListing)
);

// New Route
router.get("/new", isLoggedIn, renderNewForm);

// Show, Update, Delete Route
router
  .route("/:id") // Dynamic parameter :id
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
