const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUser,
  searchUsers,
  followUser,
  getSuggestedUsers,
} = require('../controllers/users');

router.get('/search', protect, searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/:username', protect, getUser);
router.post('/:userId/follow', protect, followUser);

module.exports = router;
