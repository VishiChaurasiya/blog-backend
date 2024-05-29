const express = require("express");
const multer = require("multer");
const upload = require("../middleware/multer");
const { getPosts, createPost } = require("../controllers/post");

const router = express.Router();

router.route("/").get(getPosts);

router.route("/").post(upload.single("image"), createPost);

module.exports = router;
