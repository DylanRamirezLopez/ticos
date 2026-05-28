const Story = require('../models/Story');
const User = require('../models/User');

exports.createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const { caption } = req.body;

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      user: req.user._id,
      image: imagePath,
      caption: caption || '',
      expiresAt,
    });

    const populatedStory = await Story.findById(story._id).populate(
      'user',
      'name username avatar'
    );

    const user = await User.findById(req.user._id).populate('followers', '_id');
    const io = req.app.get('io');
    const followerIds = user.followers.map((f) => f._id.toString());

    followerIds.forEach((followerId) => {
      io.to(followerId).emit('new-story', populatedStory);
    });

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFollowingStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingIds = [...user.following, req.user._id];

    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate('user', 'name username avatar');

    const grouped = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: [],
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (!story.viewers.includes(req.user._id)) {
      story.viewers.push(req.user._id);
      await story.save();
    }

    res.json({ message: 'Story viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this story' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
