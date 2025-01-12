// ---Reviews--------------------------------------------------------------------------------------------
const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReviews, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

// new reviews
router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewsController.postNewReview));

//delete reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.destroyReview));


module.exports = router;