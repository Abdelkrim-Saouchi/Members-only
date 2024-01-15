const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET Login page. */
router.get("/", userController.getLoginForm);

module.exports = router;
