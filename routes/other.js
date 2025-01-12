const express = require("express");
const router = express.Router();

router.get("/privacy", (req, res)=>{
    res.render("privacy.ejs");
});
router.get("/terms", (req, res)=>{
    res.render("terms.ejs");
});
router.get("/socialmediapage", (req, res)=>{
    res.render("socialpage.ejs");
});

module.exports = router;