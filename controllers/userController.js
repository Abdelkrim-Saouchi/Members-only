const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

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
  body("passwordConfirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Confirmation password does not match"),
  async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) next(err);

      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: hashedPassword,
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
          res.redirect("/users/login");
        } catch (error) {
          next(error);
        }
      }
    });
  },
];
//-------------------------------------

//--------Login route -----------------

// GET request to display login form
exports.getLoginForm = (req, res) => {
  res.render("login", { title: "Login" });
};

// POST request to login
exports.postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/users/login",
});

//--------Other user routes ---------

// GET info of specific user
exports.userDetails = async (req, res, next) => {
  if (!req.user) {
    res.redirect("/");
    return;
  }
  const user = await User.findById(req.params.id).exec();
  if (!user) {
    const err = new Error("User does not exist");
    return next(err);
  }
  res.render("profile_page", { title: "Profile", user: user });
};

// Logout
exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
