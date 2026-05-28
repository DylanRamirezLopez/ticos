const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getConversations,
  createGroup,
  joinGroup,
  sendGroupMessage,
  getGroupMessages,
  manageRole,
} = require('../controllers/messages');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getConversation);

router.post('/group', protect, createGroup);
router.post('/group/join', protect, joinGroup);
router.post('/group/message', protect, sendGroupMessage);
router.get('/group/:groupId/messages', protect, getGroupMessages);
router.put('/group/:groupId/roles', protect, manageRole);

module.exports = router;
