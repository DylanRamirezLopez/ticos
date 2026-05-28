const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createComment,
  getComments,
  likeComment,
  deleteComment,
} = require('../controllers/comments');

router.get('/:postId', protect, getComments);
router.post('/:postId', protect, createComment);
router.put('/:commentId/like', protect, likeComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
