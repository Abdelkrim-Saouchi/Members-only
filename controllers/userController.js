const User = require("../models/user");
const { body, validationResult } = require("express-validator");

// ------Sign up route-----------------
// Get request to display Sign up form
exports.getSignUpForm = (req, res) => {
  res.render("sign_up", { title: "Sign up" });
};

// POST request to create user
exports.createUserPost = [
  body("firstName", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("userName", "Username must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "email must not be empty").trim().isLength({ min: 1 }).escape(),
  body("password", "password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      res.render("sign_up", {
        title: "Sign up",
        user: user,
        errors: errors.array(),
      });
    } else {
      try {
        await user.save();
        res.redirect(user.url);
      } catch (error) {
        next(error);
      }
    }
  },
];
//-------------------------------------

//--------Login route -----------------

// GET request to display login form
exports.getLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

//--------Other user routes ---------
exports.userDetails = async (req, res) => {
  console.log("id:", req.params.id);
  res.send(`info of user : ${req.params.id}`);
};
