const express = require("express");
const router = express.Router();
const Message = require("../models/message");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const messages = await Message.find({}).populate("user").exec();
    res.render("index", { user: req.user, messages: messages });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
