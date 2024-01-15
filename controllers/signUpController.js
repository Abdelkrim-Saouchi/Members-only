// Get request to display Sign up form
exports.getSignUpForm = (req, res) => {
  res.render("sign_up", { title: "Sign up" });
};
