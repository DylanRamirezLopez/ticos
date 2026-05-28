const Message = require('../models/Message');
const User = require('../models/User');
const Post = require('../models/Post');
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const crypto = require('crypto');

const defaultRoles = (isAnonymous) => [
  {
    name: 'creator',
    permissions: {
      invite: true, createLinks: true, sendImages: true, sendLinks: true,
      sendText: true, manageRoles: true, removeMembers: true, changeName: true, pinMessages: true,
    },
  },
  {
    name: 'admin',
    permissions: {
      invite: true, createLinks: true, sendImages: true, sendLinks: true,
      sendText: true, manageRoles: false, removeMembers: true, changeName: false, pinMessages: true,
    },
  },
  {
    name: 'member',
    permissions: {
      invite: true, createLinks: false, sendImages: true, sendLinks: !isAnonymous,
      sendText: true, manageRoles: false, removeMembers: false, changeName: false, pinMessages: false,
    },
  },
];

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, sharedPost } = req.body;
    if ((!text || !text.trim()) && !sharedPost) {
      return res.status(400).json({ message: 'Message text or shared post is required' });
    }

    const sender = await User.findById(req.user._id);
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'User not found' });
    if (sender.anonymousModeEnabled !== receiver.anonymousModeEnabled) {
      return res.status(403).json({ message: 'Cannot message this user due to anonymous mode settings' });
    }

    const message = await Message.create({
      sender: req.user._id, receiver: receiverId, text: text || '', sharedPost: sharedPost || null,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender receiver', 'name username avatar')
      .populate('sharedPost');

    const io = req.app.get('io');
    io.to(receiverId).emit('new-message', populatedMessage);
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender receiver', 'name username avatar')
      .populate('sharedPost');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const messages = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: null,
          conversations: {
            $addToSet: {
              $cond: [{ $eq: ['$sender', req.user._id] }, '$receiver', '$sender'],
            },
          },
        },
      },
    ]);

    if (!messages.length || !messages[0].conversations.length) {
      return res.json({ dms: [], groups: [] });
    }

    const uniqueUserIds = [...new Set(messages[0].conversations)];
    const users = await User.find({ _id: { $in: uniqueUserIds } })
      .select('name username avatar anonymousModeEnabled');

    const filteredUsers = users.filter(
      (u) => u.anonymousModeEnabled === currentUser.anonymousModeEnabled
    );

    const conversationsWithLastMessage = await Promise.all(
      filteredUsers.map(async (u) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: req.user._id, receiver: u._id },
            { sender: u._id, receiver: req.user._id },
          ],
        })
          .sort({ createdAt: -1 })
          .populate('sender receiver', 'name username avatar')
          .populate('sharedPost');
        return { user: { _id: u._id, name: u.name, username: u.username, avatar: u.avatar }, lastMessage };
      })
    );

    conversationsWithLastMessage.sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    let groups = await Group.find({ 'members.user': req.user._id })
      .populate('members.user', 'name username avatar')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'name username' },
      });

    groups = groups.map((g) => {
      const gObj = g.toObject();
      if (g.isAnonymous) {
        gObj.members = gObj.members.map((m) => ({
          ...m,
          user: m.role === 'creator'
            ? { _id: m.user?._id, name: 'Creator', username: 'Creator', avatar: '' }
            : { _id: m.user?._id, name: 'Anonymous', username: `Member`, avatar: '' },
        }));
      }
      return gObj;
    });

    res.json({ dms: conversationsWithLastMessage, groups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, isAnonymous } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const inviteCode = crypto.randomBytes(4).toString('hex');
    const roles = defaultRoles(isAnonymous || false);

    const group = await Group.create({
      name: name.trim(),
      inviteCode,
      isAnonymous: isAnonymous || false,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'creator' }],
      roles,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const group = await Group.findOne({ inviteCode });
    if (!group) return res.status(404).json({ message: 'Invalid invite code' });

    if (group.members.some((m) => m.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push({ user: req.user._id, role: 'member' });
    await group.save();

    const populated = await Group.findById(group._id)
      .populate('members.user', 'name username avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupId, text, sharedPost } = req.body;
    if ((!text || !text.trim()) && !sharedPost) {
      return res.status(400).json({ message: 'Message text or shared post is required' });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.some((m) => m.user.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a member' });
    }

    if (!group.canUser(req.user._id, 'sendText')) {
      return res.status(403).json({ message: 'You do not have permission to send messages' });
    }

    if (sharedPost && !group.canUser(req.user._id, 'sendImages')) {
      return res.status(403).json({ message: 'You do not have permission to share media' });
    }

    const message = await GroupMessage.create({
      group: groupId, sender: req.user._id, text: text || '', sharedPost: sharedPost || null,
    });

    group.lastMessage = message._id;
    await group.save();

    const populated = await GroupMessage.findById(message._id)
      .populate('sender', 'name username avatar')
      .populate('sharedPost');

    const io = req.app.get('io');
    group.members.forEach((member) => {
      if (member.user.toString() !== req.user._id.toString()) {
        io.to(member.user.toString()).emit('new-group-message', { groupId, message: populated });
      }
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group || !group.members.some((m) => m.user.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await GroupMessage.find({ group: groupId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name username avatar')
      .populate('sharedPost');

    if (group.isAnonymous) {
      const memberRoles = {};
      group.members.forEach((m) => { memberRoles[m.user.toString()] = m.role; });
      messages.forEach((msg) => {
        if (msg.sender && memberRoles[msg.sender._id.toString()] !== 'creator') {
          msg.sender = { _id: msg.sender._id, name: 'Anonymous', username: 'anon', avatar: '' };
        }
      });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.manageRole = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { action, roleName, permissions, targetUserId, newRole } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.canUser(req.user._id, 'manageRoles')) {
      return res.status(403).json({ message: 'You do not have permission to manage roles' });
    }

    switch (action) {
      case 'createRole': {
        if (group.roles.some((r) => r.name === roleName)) {
          return res.status(400).json({ message: 'Role already exists' });
        }
        const defPerms = {
          invite: false, createLinks: false, sendImages: true, sendLinks: !group.isAnonymous,
          sendText: true, manageRoles: false, removeMembers: false, changeName: false, pinMessages: false,
        };
        group.roles.push({ name: roleName, permissions: { ...defPerms, ...permissions } });
        break;
      }
      case 'updateRole': {
        const role = group.roles.find((r) => r.name === roleName);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        if (roleName === 'creator') return res.status(403).json({ message: 'Cannot modify creator role' });
        Object.assign(role.permissions, permissions);
        break;
      }
      case 'deleteRole': {
        if (roleName === 'creator' || roleName === 'member') {
          return res.status(403).json({ message: 'Cannot delete default roles' });
        }
        group.roles = group.roles.filter((r) => r.name !== roleName);
        group.members.forEach((m) => {
          if (m.role === roleName) m.role = 'member';
        });
        break;
      }
      case 'assignRole': {
        if (!targetUserId) return res.status(400).json({ message: 'Target user required' });
        const member = group.members.find((m) => m.user.toString() === targetUserId);
        if (!member) return res.status(404).json({ message: 'User not in group' });
        if (member.role === 'creator') return res.status(403).json({ message: 'Cannot change creator role' });
        if (!group.roles.some((r) => r.name === newRole)) {
          return res.status(404).json({ message: 'Role not found' });
        }
        member.role = newRole;
        break;
      }
      case 'removeMember': {
        if (!targetUserId) return res.status(400).json({ message: 'Target user required' });
        if (!group.canUser(req.user._id, 'removeMembers')) {
          return res.status(403).json({ message: 'No permission to remove members' });
        }
        const targetMember = group.members.find((m) => m.user.toString() === targetUserId);
        if (!targetMember) return res.status(404).json({ message: 'User not in group' });
        if (targetMember.role === 'creator') return res.status(403).json({ message: 'Cannot remove creator' });
        group.members = group.members.filter((m) => m.user.toString() !== targetUserId);
        break;
      }
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await group.save();
    const populated = await Group.findById(group._id)
      .populate('members.user', 'name username avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
