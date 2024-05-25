// controllers/commentController.js
const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      author: req.user._id,
      post: postId,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Comment.countDocuments({ post: postId });

    res.json({
      comments,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPostId,
};
