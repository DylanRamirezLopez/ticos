const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { setupCloudinary } = require('../config/cloudinary');
const validate = require('../middleware/validate');

const cloudinary = setupCloudinary();

exports.createPost = async (req, res) => {
  try {
    const { caption, text, isAnonymous } = req.body;
    const postType = req.file ? 'image' : text ? 'text' : null;

    if (!postType) {
      return res
        .status(400)
        .json({ message: 'Image or text content is required' });
    }

    const postData = {
      user: req.user._id,
      type: postType,
      caption: caption || '',
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
    };

    if (postType === 'image') {
      postData.image = `/uploads/${req.file.filename}`;
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      const fileBuffer = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      postData.fileHash = hash;
      postData.fileMetadata = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      if (cloudinary) {
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            folder: 'ticos/posts',
          });
          postData.image = result.secure_url;
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('[CLOUDINARY ERROR]', e.message);
        }
      }
    } else {
      const textErrors = validate.string('Text', text, { maxLen: 10000 });
      if (textErrors.length) {
        return res.status(400).json({ message: textErrors[0] });
      }
      postData.text = validate.sanitize(text);
    }

    const captionErrors = validate.string('Caption', caption, { maxLen: 2200, required: false });
    if (captionErrors.length) {
      return res.status(400).json({ message: captionErrors[0] });
    }

    const post = await Post.create(postData);

    const populatedPost = await Post.findById(post._id).populate(
      'user',
      'name username avatar'
    );

    if (!postData.isAnonymous) {
      const io = req.app.get('io');
      const user = await User.findById(req.user._id).populate(
        'followers',
        '_id'
      );
      const followerIds = user.followers.map((f) => f._id.toString());

      followerIds.forEach((followerId) => {
        io.to(followerId).emit('new-post', populatedPost);
      });
    }

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const followingIds = [...currentUser.following, req.user._id];

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = { user: { $in: followingIds } };

    if (currentUser.anonymousModeEnabled) {
      filter.isAnonymous = true;
    } else {
      filter.isAnonymous = { $ne: true };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username avatar');

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGlobalFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (currentUser.anonymousModeEnabled) {
      filter.isAnonymous = true;
    } else {
      filter.isAnonymous = { $ne: true };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username avatar');

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      'user',
      'name username avatar'
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUser = await User.findById(req.user._id);
    const filter = { user: userId };

    if (currentUser.anonymousModeEnabled) {
      filter.isAnonymous = true;
    } else {
      filter.isAnonymous = { $ne: true };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name username avatar');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
    }

    if (post.image) {
      const filename = post.image.replace('/uploads/', '');
      const filepath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
