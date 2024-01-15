const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

/* GET Sign up page. */
router.get("/", signUpController.getSignUpForm);

module.exports = router;
