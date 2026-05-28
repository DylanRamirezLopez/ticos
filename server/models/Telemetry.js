const mongoose = require('mongoose');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'ticos-admin-secret').digest('hex').substring(0, 32);
const iv = crypto.createHash('md5').update(process.env.JWT_SECRET || 'ticos-admin-iv').digest('hex').substring(0, 16);

function encrypt(text) {
  if (!text) return '';
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  if (!encrypted) return '';
  try {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '[encrypted]';
  }
}

const telemetrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  anonymousId: { type: String, default: '' },
  action: { type: String, required: true },
  endpoint: { type: String, default: '' },
  method: { type: String, default: '' },
  encryptedIp: { type: String, default: '' },
  encryptedLocation: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  isp: { type: String, default: '' },
  statusCode: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

telemetrySchema.index({ user: 1, createdAt: -1 });
telemetrySchema.index({ action: 1, createdAt: -1 });
telemetrySchema.index({ createdAt: -1 });

telemetrySchema.methods.decryptIp = function () { return decrypt(this.encryptedIp); };
telemetrySchema.methods.decryptLocation = function () { return decrypt(this.encryptedLocation); };

telemetrySchema.statics.encryptField = function (text) { return encrypt(text); };

module.exports = mongoose.model('Telemetry', telemetrySchema);
