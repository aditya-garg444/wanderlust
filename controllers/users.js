const User = require("../models/user.js");

module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { user } = req.body;
    const newUser = new User({
      email: user.email,
      username: user.username,
    });
    const registeredUser = await User.register(newUser, user.password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (er) {
    req.flash("error", er.message);
    res.redirect("/signup");
  }
};

module.exports.getLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginSuccess = async (req, res) => {
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || res.locals.referer || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
      if (err) return next(err);
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    });
}