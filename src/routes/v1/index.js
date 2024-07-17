const express = require("express");

const upload = require("./upload.route");
// const statusController = require('../../controllers/status');
// const webhookController = require("../../controllers/webhook");
// const downloadController = require("../../controllers/download");

const router = express.Router();

// test route
router.get("/", (req, res) => res.json({ test: "server is serving..." }));

// handle uploads
router.use("/upload", upload);

module.exports = router;
