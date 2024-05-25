
const express = require('express');
const { createComment, getCommentsByPostId } = require('../Controller/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:postId', protect, createComment);
router.get('/:postId', getCommentsByPostId);

module.exports = router;
