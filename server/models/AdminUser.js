const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  adminCode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'moderator'],
    default: 'admin',
  },
  lastLogin: { type: Date, default: null },
  lastIp: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  auditLog: [{
    action: String,
    target: String,
    details: Object,
    ip: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('adminCode')) return next();
  const salt = await bcrypt.genSalt(12);
  this.adminCode = await bcrypt.hash(this.adminCode, salt);
  next();
});

adminSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

adminSchema.methods.matchAdminCode = async function (entered) {
  return await bcrypt.compare(entered, this.adminCode);
};

adminSchema.methods.addAuditLog = function (action, target, details, ip) {
  this.auditLog.push({ action, target, details, ip, timestamp: new Date() });
  if (this.auditLog.length > 500) {
    this.auditLog = this.auditLog.slice(-500);
  }
  return this.save();
};

module.exports = mongoose.model('AdminUser', adminSchema);
