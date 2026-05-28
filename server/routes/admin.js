const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { adminProtect, superAdminOnly } = require('../middleware/admin');
const {
  adminLogin,
  getDashboard,
  getUsers,
  getUserDetail,
  getTelemetry,
  getAuditLog,
  createAdminUser,
} = require('../controllers/admin');

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many admin login attempts' },
});

router.post('/login', adminLoginLimiter, adminLogin);
router.get('/dashboard', adminProtect, getDashboard);
router.get('/users', adminProtect, getUsers);
router.get('/users/:userId', adminProtect, getUserDetail);
router.get('/telemetry', adminProtect, getTelemetry);
router.get('/audit-log', adminProtect, getAuditLog);
router.post('/create-admin', adminProtect, superAdminOnly, createAdminUser);

module.exports = router;
