const { Schema, model } = require("mongoose");

const tagSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tag = model("Tag", tagSchema);

module.exports = Tag;
