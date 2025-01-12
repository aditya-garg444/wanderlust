let Listing = require("./models/listing.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const {cloudinary} = require("./cloudConfig.js");

module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error) {
      let errMsg = error.details.map((el)=>el.message).join(',');
      throw new ExpressError(400, errMsg, error.name);
  } else {
      next();
  }
};

module.exports.validateReviews = (req, res, next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error) {
      let errMsg = error.details.map((el)=>el.message).join(',');
      throw new ExpressError(400, errMsg, error.name);
  } else {
      next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first");
    res.redirect("/login");
  } else next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl;
  res.locals.referer = req.session.referer;
  next();
};

module.exports.saveReferer = (req, res, next) => {
  req.session.referer = req.get("Referer");
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let {id} = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(listing.owner.username != req.user.username) {
        req.flash("error", "Only owner of the listing can update the listing");
        res.redirect(`/listings/${id}`);
    }
    else next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId} = req.params;
  const review = await Review.findById(reviewId).populate("author");
  if(review.author.username != req.user.username) {
    req.flash("error", "You are not the author of the review you are trying to delete");
    res.redirect(`/listings/${id}`);
    return;
  }
  else next();
};

module.exports.deleteUploadedImage = async (req, res, next) => {
  console.log(req);
  let {id} = req.params;
  if(req.file || req.method === "DELETE") {
    try{
      let listing = await Listing.findById(id);
      let originalFileName = listing.image.filename;
      await cloudinary.uploader.destroy(originalFileName);
    } catch(error) {
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(500, errMsg, error.name);
    }
  }
  next();
}

module.exports.fetchCountryList = async (req, res, next) => {
  let countriesList = await Listing.find().distinct("country");
  req.session.countriesList = countriesList;
  next();
}