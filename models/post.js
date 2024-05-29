const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: Buffer,
    },
    author: {
      type: String,
    },
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    },
  },
  { timestamps: true }
);

const Post = model("Post", postSchema);

module.exports = Post;
