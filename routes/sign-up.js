const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET Sign up page. */
router.get("/", userController.getSignUpForm);

module.exports = router;
