const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const { read } = require("fs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");   
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
         console.log(allListings);
         res.render("listings/index.ejs", { allListings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).send("Server Error");
    }
});

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
  })
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route 
app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    try {
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(`Deleted Listing: ${deletedListing}`);
        res.redirect("/listings");
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).send("Server Error");
    }
}));

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "calangute, Goa",
//         county: "India" 
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull testing");
// });

app.all("*", (req, res, next) =>{
    next(new ExpressError(404,"Page Not Found!"))
})

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listining to port 8080");
});


