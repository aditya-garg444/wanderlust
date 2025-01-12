const Listing = require("../models/listing.js");
const opencage = require("opencage-api-client");
const {categories, countries} = require("../utils/selectFormData.js");

//Index Route
module.exports.index = async (req, res)=>{
    let { filter } = req.query;
    const allListings = await Listing.find();

    const filteredListings = (filter && filter !== 'All') ? allListings.filter(listing => listing.category === filter) : allListings;
    const otherListings = (filter && filter !== 'All') ? allListings.filter(listing => listing.category !== filter) : [];
    res.render("listings/index.ejs", { filteredListings, otherListings, selectedFilter: filter || 'All', });
};

//New Route
module.exports.new = (req, res)=>{
    res.render("listings/new.ejs", {categories, countries});
};

//Show Route
module.exports.show = async (req, res)=>{
    let {id} = req.params;
    const currentListing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!currentListing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    const reviews = currentListing.reviews;
    res.render("listings/show.ejs", {currentListing, reviews});
};

//Create Route
module.exports.create = async (req, res)=>{
    const result = await opencage.geocode({ q: (req.body.listing.location + ", " + req.body.listing.country), limit: 1 });
    let {lat, lng} = result.results[0].geometry;
    const geoJson = {
        type: 'Point',
        coordinates: [lng, lat],
    };

    let url = "", filename = ""; //assigning empty incase no photo is uploaded so we will assign a default value for url and filename using mongoose
    if(req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = geoJson;
    const saved = await newListing.save();
    console.log(saved);
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

//Edit Route
module.exports.edit = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("owner"); 
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let imageUrl = listing.image.url;
    imageUrl = imageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, imageUrl, categories, countries});
};

//Update Route
module.exports.update = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const {location, country} = listing;
    let newListing = req.body.listing;
    if(newListing.location !== location || newListing.country !== country) {
        const result = await opencage.geocode({ q: (req.body.listing.location + ", " + req.body.listing.country), limit: 1 });
        let {lat, lng} = result.results[0].geometry;
        const geoJson = {
            type: 'Point',
            coordinates: [lng, lat],
        };
        newListing.geometry = geoJson;
    }
    let updatedListing = await Listing.findByIdAndUpdate(id, newListing, {new: true, runValidators: true});
    if(req.file) {
        const {path, filename} = req.file;
        updatedListing.image = {url: path, filename};
        await updatedListing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.delete = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};

//Search Route
module.exports.search = async (req, res)=>{
  let {country: inpCountry} = req.query;
  let searchedListings = [];
  if(inpCountry) {
    searchedListings = await Listing.find({country: inpCountry});
  }
  if(searchedListings.length === 0) {
    searchedListings = await Listing.find();
    req.flash("error", "No listing found for country you entered");
    return res.redirect("/listings");
  }
  res.render("listings/search.ejs", {allListings: searchedListings});
};