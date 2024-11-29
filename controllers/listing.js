const { model } = require("mongoose");
const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).send("Server Error");
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // Only update the image if a new value is provided
  const updateData = req.body.listing;

  // If no image is provided, retain the current one
  if (!updateData.image || updateData.image.trim() === "") {
    delete updateData.image; // Do not modify the image if it's empty
  }

  await Listing.findByIdAndUpdate(id, updateData);
  req.flash("success", "Listing Update!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  try {
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(`Deleted Listing: ${deletedListing}`);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).send("Server Error");
  }
};