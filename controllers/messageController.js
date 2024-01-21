const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Message = require("../models/message");

// GET Controller to get create message form
exports.createMessageFormGet = (req, res, next) => {
  // Check if user is authenticated

  if (!req.user) {
    res.redirect("/");
    return;
  }
  res.render("create_message_form", {
    title: "Create message",
    user: req.user,
  });
};

//POST controller to create message
exports.createMessageFormPost = [
  body("title", "must not be empty").trim().isLength({ min: 1 }).escape(),
  body("text", "Provide a text message").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      res.redirect("/");
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("create_message_form", {
        title: "Create message",
        user: req.user,
        errors: errors.array(),
      });
      return;
    }
    const message = new Message({
      user: req.user._id,
      title: req.body.title,
      text: req.body.text,
    });

    try {
      await message.save();
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];
