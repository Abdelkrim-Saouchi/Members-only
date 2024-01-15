const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET Sign up page.
router.get("/sign-up", userController.getSignUpForm);

// POST request to create user
router.post("/sign-up", userController.createUserPost);

/* GET Login page. */
router.get("/login", userController.getLoginForm);

// GET specific user page
router.get("/profile/:id", userController.userDetails);

// POST

module.exports = router;
