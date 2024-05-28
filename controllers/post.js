const Post = require("../models/post");
const Tag = require("../models/tag");

async function getPosts(req, res) {
  try {
    const { keyword, _sort, _order, _page = 1, _limit = 10, tag } = req.query;

    // Build the query object
    let query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { desc: { $regex: keyword, $options: "i" } },
      ];
    }
    if (tag) {
      const tagObj = await Tag.findOne({ slug: tag });
      if (tagObj) {
        query.tags = { $in: [tagObj._id] };
      }
    }

    // Build the sort object
    let sort = {};
    if (_sort) {
      sort[_sort] = _order === "desc" ? -1 : 1;
    }

    // Pagination options
    const page = parseInt(_page, 10);
    const limit = parseInt(_limit, 10);
    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate("tags")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
}

async function createPost(req, res) {
  try {
    const { title, desc, author, tags } = req.body;

    if (!title || !desc)
      return res
        .status(400)
        .json({ error: "Title and Description must be provided" });

    const duplicateTitle = await Post.findOne({ title });
    if (duplicateTitle)
      return res.status(400).json({ error: "Title must be unique" });

    const newPost = new Post({
      title,
      desc,
      author,
    });

    if (req?.file?.buffer) newPost.image = req.file.buffer;
    if (tags) {
      const tagObjects = await Tag.find({
        slug: { $in: JSON.parse(tags) },
      });

      if (!tagObjects)
        return res.status(400).json({ error: "Invalid tags are sent" });

      const tagIds = tagObjects.map((tag) => tag._id);
      newPost.tags = tagIds;
    }

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
}

module.exports = {
  getPosts,
  createPost,
};
