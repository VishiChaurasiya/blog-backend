const express = require("express");
const { getTags } = require("../controllers/tag");

const router = express.Router();

router.get("/", getTags);

module.exports = router;
