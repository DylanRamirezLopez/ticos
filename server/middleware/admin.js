const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const adminProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Admin ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Admin access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET + '_admin');
    const admin = await AdminUser.findById(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin account inactive or not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid admin token' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};

module.exports = { adminProtect, superAdminOnly };
