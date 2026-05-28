const mongoose = require('mongoose');

const permissionSchema = {
  invite: { type: Boolean, default: false },
  createLinks: { type: Boolean, default: false },
  sendImages: { type: Boolean, default: false },
  sendLinks: { type: Boolean, default: false },
  sendText: { type: Boolean, default: true },
  manageRoles: { type: Boolean, default: false },
  removeMembers: { type: Boolean, default: false },
  changeName: { type: Boolean, default: false },
  pinMessages: { type: Boolean, default: false },
};

const defaultRole = (name, perms = {}) => ({
  name,
  permissions: { ...permissionSchema, ...perms },
});

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
    },
    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, default: 'member' },
      },
    ],
    roles: [
      {
        name: { type: String, required: true },
        permissions: permissionSchema,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GroupMessage',
    },
  },
  { timestamps: true }
);

groupSchema.index({ 'members.user': 1 });

groupSchema.pre('save', function (next) {
  if (this.isNew) {
    const creatorExists = this.members.some(
      (m) => m.user.toString() === this.createdBy.toString() && m.role === 'creator'
    );
    if (!creatorExists) {
      this.members.push({ user: this.createdBy, role: 'creator' });
    }
  }
  next();
});

groupSchema.methods.getPermissionsForUser = function (userId) {
  const member = this.members.find(
    (m) => m.user.toString() === userId.toString()
  );
  if (!member) return null;

  const roleDef = this.roles.find((r) => r.name === member.role);
  if (!roleDef) return null;

  return roleDef.permissions;
};

groupSchema.methods.canUser = function (userId, permission) {
  const perms = this.getPermissionsForUser(userId);
  if (!perms) return false;
  return perms[permission] === true;
};

module.exports = mongoose.model('Group', groupSchema);
