const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET request to display create message form
router.get("/create", messageController.createMessageFormGet);

// POST request to create message
router.post("/create", messageController.createMessageFormPost);

module.exports = router;
