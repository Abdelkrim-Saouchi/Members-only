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
          userInfo: user,
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
exports.postLogin = [
  body("email", "Invalid email").trim().isLength({ min: 1 }).escape(),
  body("password", "Invalid password").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.render("login", { title: "Login", errors: errors.array() });
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.render("login", { title: "Login", errorMsg: info.message });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    })(req, res, next);
  },
];

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

// POST controller to become a member
exports.becomeMember = [
  body("passCode", "Invalid pass!").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      const err = new Error("User not found");
      return next(err);
    }
    if (!errors.isEmpty()) {
      res.render("profile_page", {
        title: "Profile",
        user: user,
        errors: errors.array(),
      });
      return;
    }

    // I prefer to store it in memory
    const SECRET_CODE = "12df54kesAA";
    if (SECRET_CODE === req.body.passCode) {
      user.isMember = true;
      try {
        const updatedUser = await user.save();
        res.redirect(updatedUser.url);
        return;
      } catch (err) {
        return next(err);
      }
    } else {
      res.render("profile_page", {
        title: "Profile",
        user: user,
        errors: [{ msg: "PassCode incorrect!" }],
      });
    }
  },
];

// POST controller to become an Admin
exports.becomeAdmin = [
  body("adminPass", "Invalid pass!").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.params.id).exec();

    if (!user) {
      const err = new Error("User not found");
      return next(err);
    }
    if (!errors.isEmpty()) {
      res.render("profile_page", {
        title: "Profile",
        user: user,
        errors: errors.array(),
      });
      return;
    }

    // I prefer to store it in memory
    const SECRET_CODE = "12HHHDSRnbt";
    if (SECRET_CODE === req.body.adminPass) {
      user.isAdmin = true;
      try {
        const updatedUser = await user.save();
        res.redirect(updatedUser.url);
        return;
      } catch (err) {
        return next(err);
      }
    } else {
      res.render("profile_page", {
        title: "Profile",
        user: user,
        errors: [{ msg: "Admin pass incorrect!" }],
      });
    }
  },
];

// GET controller to render rules page
exports.getRules = (req, res, next) => {
  res.render("rules", { title: "Club rules", user: req.user });
};
