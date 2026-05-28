const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createEcho,
  getEchoFeed,
  getEchoReplies,
  reactToEcho,
  getSentimentStats,
} = require('../controllers/echo');

router.post('/', protect, createEcho);
router.get('/feed', protect, getEchoFeed);
router.get('/stats', protect, getSentimentStats);
router.get('/:echoId/replies', protect, getEchoReplies);
router.post('/:echoId/react', protect, reactToEcho);

module.exports = router;
