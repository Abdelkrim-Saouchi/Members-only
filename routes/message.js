const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET request to display create message form
router.get("/create", messageController.createMessageFormGet);

// POST request to create message
router.post("/create", messageController.createMessageFormPost);

// GET request to delete message
router.get("/:id/delete", messageController.deleteMessageGet);

// POST request to delete message
router.post("/:id/delete", messageController.deleteMessagePost);

module.exports = router;
