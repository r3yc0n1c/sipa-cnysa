const express = require("express");
const webhookController = require("../../controllers/webhook");
const verifyWebhook = require("../../middlewares/verifyWebhook");

const router = express.Router();

router.get("/", (req, res) => res.send("webhook hooking"));
router.post("/", verifyWebhook, webhookController);

module.exports = router;
