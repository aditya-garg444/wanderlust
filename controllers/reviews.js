const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//new reviews
module.exports.postNewReview = async (req, res)=>{
    let {id} = req.params;
    let newRev = new Review(req.body.review);
    newRev.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newRev);
    await newRev.save();
    await listing.save();
    req.flash("success", "New review added");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
};