const express = require("express");

const upload = require("./upload.route");
const webhook = require("./webhook.route");
const status = require("./status.route");

const router = express.Router();

// test route
router.get("/", (req, res) => res.json({ test: "server is serving..." }));

// handle uploads
router.use("/upload", upload);
router.use("/webhook", webhook);
router.use("/status", status);

module.exports = router;
