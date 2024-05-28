const express = require("express");
const multer = require("multer");
const { getPosts, createPost } = require("../controllers/post");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/").get(getPosts);

router.route("/").post(upload.single("image"), createPost);

module.exports = router;
