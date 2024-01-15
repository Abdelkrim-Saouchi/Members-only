const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

/* GET Login page. */
router.get("/", loginController.getLoginForm);

module.exports = router;
