// GET request to display login form
exports.getLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};
