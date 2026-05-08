const user = require("../models/user.js");
const passport = require("passport");

module.exports.signupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.postMethodForm = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new user({
      email,
      username
    });

    const registeredUser = await user.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "User was registered");
      res.redirect("/listings");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/listings");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.loginFormPost = (req, res) => {
  // duplicate flash avoid karne ke liye yaha success flash hata diya
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutFun = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You have logged out");
    res.redirect("/listings");
  });
};