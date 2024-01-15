const User = require("../models/user");

// Get request to display Sign up form
exports.getSignUpForm = (req, res) => {
  res.render("sign_up", { title: "Sign up" });
};

// GET request to display login form
exports.getLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};
