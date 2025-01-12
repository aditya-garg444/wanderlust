const express = require("express");
const router = express.Router();
const passport = require("passport");
const  {saveRedirectUrl, saveReferer}  = require("../middleware.js");
const usersController = require("../controllers/users.js");

router.route("/signup")
  .get(usersController.getSignupForm)
  .post(usersController.signUp)

router.route("/login")
  .get(saveReferer, usersController.getLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.loginSuccess
  )

router.get("/logout", usersController.logOut);

module.exports = router;
