const Tag = require("../models/tag");

async function getTags(req, res) {
  try {
    const tags = await Tag.find();

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tags" });
  }
}

module.exports = {
  getTags,
};
