const express = require("express");
const statusController = require("../../controllers/status");

const router = express.Router();

router.get("/", statusController);

module.exports = router;
