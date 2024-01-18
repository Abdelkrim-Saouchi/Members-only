const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET Sign up page.
router.get("/sign-up", userController.getSignUpForm);

// POST request to create user
router.post("/sign-up", userController.createUserPost);

/* GET Login page. */
router.get("/login", userController.getLoginForm);

// POST Login page
router.post("/login", userController.postLogin);

// GET specific user page
router.get("/profile/:id", userController.userDetails);

// GET request to logout
router.get("/logout", userController.logout);

module.exports = router;
