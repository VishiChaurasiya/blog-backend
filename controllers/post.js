const Post = require("../models/post");
const Tag = require("../models/tag");

async function getPosts(req, res) {
  try {
    const { keyword, _sort, _order, _page = 1, _limit = 10, tag } = req.query;

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

    let sort = {};
    if (_sort) {
      sort[_sort] = _order === "desc" ? -1 : 1;
    }

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
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function createPost(req, res) {
  try {
    const { slug, title, desc, author, tags } = req.body;

    if (!slug || !title || !desc)
      return res
        .status(400)
        .json({ error: "Slug, Title and Description must be provided" });

    const duplicateTitle = await Post.findOne({ title });
    if (duplicateTitle)
      return res.status(400).json({ error: "Title must be unique" });

    const duplicateSlug = await Post.findOne({ slug });
    if (duplicateSlug)
      return res.status(400).json({ error: "Slug must be unique" });

    const newPost = new Post({
      slug,
      title,
      desc,
      author,
    });

    if (req?.file?.buffer) newPost.image = req.file.buffer;
    if (tags) {
      const tagObjects = await Tag.find({
        slug: { $in: JSON.parse(tags) },
      });

      const tagIds = tagObjects.map((tag) => tag._id);
      newPost.tags = tagIds;
    }

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  getPosts,
  createPost,
};
