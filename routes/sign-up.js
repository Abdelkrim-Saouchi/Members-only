const express = require("express");
const router = express.Router();

/* GET Sign up page. */
router.get("/", function (req, res, next) {
  res.render("sign_up");
});

module.exports = router;
