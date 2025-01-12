//-- Listings---------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner, deleteUploadedImage} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const Listing = require("../models/listing.js");

//Index and Create Route
router.route("/")
  .get(wrapAsync(listingsController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingsController.create));
  
//New Route
router.get("/new", isLoggedIn, listingsController.new);

//Search Route
router.get("/search", listingsController.search);

// to fetch countries list
router.get("/countries", wrapAsync(async (req, res) => {
  const countries = await Listing.find().distinct('country'); // Get all distinct countries
  res.json(countries); // Send back the list of countries
}));

//Show, Update and Delete Route
router.route("/:id")
  .get(wrapAsync(listingsController.show))
  .patch(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, deleteUploadedImage, wrapAsync(listingsController.update))
  .delete(isLoggedIn, isOwner, deleteUploadedImage, wrapAsync(listingsController.delete))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.edit));


module.exports = router;