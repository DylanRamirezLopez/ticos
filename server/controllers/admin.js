const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Telemetry = require('../models/Telemetry');
const Echo = require('../models/Echo');

const generateAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + '_admin', { expiresIn: '2h' });
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password, adminCode } = req.body;

    if (!username || !password || !adminCode) {
      return res.status(400).json({ message: 'Username, password, and admin code required' });
    }

    const admin = await AdminUser.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await admin.matchPassword(password);
    const isCodeValid = await admin.matchAdminCode(adminCode);

    if (!isPasswordValid || !isCodeValid) {
      await admin.addAuditLog('FAILED_LOGIN', username, { ip: req.ip }, req.ip);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    admin.lastIp = req.ip || '';
    await admin.addAuditLog('LOGIN', username, { ip: req.ip }, req.ip);
    await admin.save();

    res.json({
      token: generateAdminToken(admin._id),
      admin: {
        _id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('[ADMIN LOGIN ERROR]', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalPosts, totalEchoes, totalMessages, newUsersToday, activeToday, totalTelemetry] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Echo.countDocuments(),
      Message.countDocuments(),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      Telemetry.countDocuments({ createdAt: { $gte: todayStart } }),
      Telemetry.countDocuments(),
    ]);

    const recentTelemetry = await Telemetry.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('user', 'name username avatar')
      .lean();

    const topEndpoints = await Telemetry.aggregate([
      { $group: { _id: '$endpoint', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    await req.admin.addAuditLog('VIEW_DASHBOARD', 'dashboard', {}, req.ip);

    res.json({
      stats: { totalUsers, totalPosts, totalEchoes, totalMessages, newUsersToday, activeToday, totalTelemetry },
      recentTelemetry,
      topEndpoints,
      admin: { username: req.admin.username, role: req.admin.role },
    });
  } catch (error) {
    console.error('[ADMIN DASHBOARD ERROR]', error.message);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const search = req.query.q || '';

    const filter = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    const usersWithTelemetry = await Promise.all(
      users.map(async (u) => {
        const lastActivity = await Telemetry.findOne({ user: u._id }).sort({ createdAt: -1 }).lean();
        const activityCount = await Telemetry.countDocuments({ user: u._id });
        const postsCount = await Post.countDocuments({ user: u._id });
        return {
          ...u,
          lastActivity: lastActivity?.createdAt || null,
          lastIp: lastActivity ? '[encrypted]' : null,
          lastCountry: lastActivity?.country || null,
          lastCity: lastActivity?.city || null,
          activityCount,
          postsCount,
        };
      })
    );

    await req.admin.addAuditLog('VIEW_USERS', 'users', { search, page }, req.ip);

    res.json({ users: usersWithTelemetry, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('[ADMIN USERS ERROR]', error.message);
    res.status(500).json({ message: 'Failed to load users' });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [posts, telemetry, messagesSent, messagesReceived] = await Promise.all([
      Post.find({ user: userId }).sort({ createdAt: -1 }).limit(50).lean(),
      Telemetry.find({ user: userId }).sort({ createdAt: -1 }).limit(100).lean(),
      Message.find({ sender: userId }).sort({ createdAt: -1 }).limit(50).populate('receiver', 'name username').lean(),
      Message.find({ receiver: userId }).sort({ createdAt: -1 }).limit(50).populate('sender', 'name username').lean(),
    ]);

    const telemetryWithDecrypted = telemetry.map((t) => ({
      ...t,
      ip: '[encrypted]',
    }));

    const loginHistory = telemetry
      .filter((t) => t.action === 'login' || t.action === '/auth/login')
      .map((t) => ({
        time: t.createdAt,
        country: t.country,
        city: t.city,
        ip: '[encrypted]',
        userAgent: t.userAgent,
      }));

    await req.admin.addAuditLog('VIEW_USER', userId, { username: user.username }, req.ip);

    res.json({
      user,
      stats: {
        postsCount: posts.length,
        telemetryCount: telemetry.length,
        messagesSent: messagesSent.length,
        messagesReceived: messagesReceived.length,
      },
      posts,
      telemetry: telemetryWithDecrypted.slice(0, 20),
      loginHistory: loginHistory.slice(0, 20),
      messages: {
        sent: messagesSent.slice(0, 20),
        received: messagesReceived.slice(0, 20),
      },
    });
  } catch (error) {
    console.error('[ADMIN USER DETAIL ERROR]', error.message);
    res.status(500).json({ message: 'Failed to load user details' });
  }
};

exports.getTelemetry = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;
    const action = req.query.action || '';

    const filter = action ? { action } : {};

    const telemetry = await Telemetry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username')
      .lean();

    const total = await Telemetry.countDocuments(filter);

    const summary = await Telemetry.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
      { $limit: 30 },
    ]);

    const topUsers = await Telemetry.aggregate([
      { $match: { user: { $ne: null } } },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { count: 1, 'user.username': 1, 'user.name': 1 } },
    ]);

    await req.admin.addAuditLog('VIEW_TELEMETRY', 'telemetry', { action, page }, req.ip);

    res.json({
      telemetry,
      total,
      page,
      pages: Math.ceil(total / limit),
      summary,
      topUsers,
    });
  } catch (error) {
    console.error('[ADMIN TELEMETRY ERROR]', error.message);
    res.status(500).json({ message: 'Failed to load telemetry' });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;

    const admin = await AdminUser.findById(req.admin._id).select('auditLog').lean();
    const logs = (admin?.auditLog || []).reverse().slice((page - 1) * limit, page * limit);

    res.json({
      logs,
      total: admin?.auditLog?.length || 0,
      page,
      pages: Math.ceil((admin?.auditLog?.length || 0) / limit),
    });
  } catch (error) {
    console.error('[ADMIN AUDIT ERROR]', error.message);
    res.status(500).json({ message: 'Failed to load audit log' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { username, password, adminCode, role } = req.body;

    if (!username || !password || !adminCode) {
      return res.status(400).json({ message: 'Username, password, and admin code required' });
    }

    const existing = await AdminUser.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Admin user exists' });

    const admin = await AdminUser.create({
      username: username.toLowerCase().trim(),
      password,
      adminCode,
      role: role || 'admin',
    });

    await req.admin.addAuditLog('CREATE_ADMIN', admin._id.toString(), { username: admin.username }, req.ip);

    res.status(201).json({ message: 'Admin created', username: admin.username, role: admin.role });
  } catch (error) {
    console.error('[ADMIN CREATE ERROR]', error.message);
    res.status(500).json({ message: 'Failed to create admin' });
  }
};

exports.seedAdmin = async () => {
  try {
    const existing = await AdminUser.findOne({ username: 'dylan' });
    if (!existing) {
      await AdminUser.create({
        username: 'dylan',
        password: 'Admin2026!secure',
        adminCode: 'TICOS-ADMIN-2026',
        role: 'superadmin',
      });
      console.log('[ADMIN] Super admin created: dylan / Admin2026!secure / TICOS-ADMIN-2026');
    }
  } catch (e) {
    console.error('[ADMIN SEED ERROR]', e.message);
  }
};
