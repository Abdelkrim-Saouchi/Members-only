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

// GET controller to get delete form
exports.deleteMessageGet = async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    res.redirect("/");
    return;
  }
  try {
    const message = await Message.findById(req.params.id, "title").exec();
    res.render("delete_form", {
      title: "Delete Message",
      message: message,
      user: req.user,
    });
    return;
  } catch (err) {
    next(err);
  }
};

// POST controller to delete message
exports.deleteMessagePost = [
  body("messageId", "Invalid id").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      res.redirect("/");
      return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("/");
      return;
    }

    try {
      
      await Message.findByIdAndDelete(req.body.messageId);
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];
