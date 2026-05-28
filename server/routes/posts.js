const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const { setupCloudinary } = require('../config/cloudinary');
const {
  createPost,
  getFeedPosts,
  getGlobalFeed,
  getUserPosts,
  getPost,
  likePost,
  deletePost,
} = require('../controllers/posts');

const cloudinary = setupCloudinary();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeedPosts);
router.get('/global', protect, getGlobalFeed);
router.get('/user/:userId', protect, getUserPosts);
router.get('/:postId', protect, getPost);
router.put('/:postId/like', protect, likePost);
router.delete('/:postId', protect, deletePost);

module.exports = router;
