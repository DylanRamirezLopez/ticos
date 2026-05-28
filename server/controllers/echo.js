const Echo = require('../models/Echo');
const { analyzeSentiment, sentimentEmojis, sentimentLabels } = require('../utils/sentiment');

exports.createEcho = async (req, res) => {
  try {
    const { text, replyTo } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const sentiment = analyzeSentiment(text);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const echo = await Echo.create({
      text: text.trim(),
      sentiment,
      expiresAt,
      replyTo: replyTo || null,
    });

    if (replyTo) {
      await Echo.findByIdAndUpdate(replyTo, { $inc: { replyCount: 1 } });
    }

    const sameSentimentCount = await Echo.countDocuments({
      sentiment,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    res.status(201).json({
      _id: echo._id,
      text: echo.text,
      sentiment: echo.sentiment,
      emoji: sentimentEmojis[sentiment] || '💭',
      label: sentimentLabels.en[sentiment] || 'Sharing Thoughts',
      reactionCounts: Object.fromEntries(echo.reactionCounts || new Map()),
      replyTo: echo.replyTo,
      replyCount: echo.replyCount,
      expiresAt: echo.expiresAt,
      createdAt: echo.createdAt,
      sameSentimentCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEchoFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const echoes = await Echo.find({ replyTo: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Echo.countDocuments({ replyTo: null });

    const enriched = await Promise.all(
      echoes.map(async (echo) => {
        const sameSentimentCount = await Echo.countDocuments({
          sentiment: echo.sentiment,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });

        return {
          _id: echo._id,
          text: echo.text,
          sentiment: echo.sentiment,
          emoji: sentimentEmojis[echo.sentiment] || '💭',
          label: sentimentLabels.en[echo.sentiment] || 'Sharing Thoughts',
          reactionCounts: Object.fromEntries(echo.reactionCounts || new Map()),
          replyCount: echo.replyCount,
          expiresAt: echo.expiresAt,
          createdAt: echo.createdAt,
          sameSentimentCount,
        };
      })
    );

    res.json({
      echoes: enriched,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEchoReplies = async (req, res) => {
  try {
    const { echoId } = req.params;

    const replies = await Echo.find({ replyTo: echoId })
      .sort({ createdAt: -1 })
      .limit(50);

    const enriched = replies.map((reply) => ({
      _id: reply._id,
      text: reply.text,
      sentiment: reply.sentiment,
      emoji: sentimentEmojis[reply.sentiment] || '💭',
      label: sentimentLabels.en[reply.sentiment] || 'Sharing Thoughts',
      reactionCounts: Object.fromEntries(reply.reactionCounts || new Map()),
      replyCount: reply.replyCount,
      expiresAt: reply.expiresAt,
      createdAt: reply.createdAt,
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reactToEcho = async (req, res) => {
  try {
    const { reaction } = req.body;
    const echo = await Echo.findById(req.params.echoId);

    if (!echo) {
      return res.status(404).json({ message: 'Echo not found' });
    }

    const allowedReactions = ['❤️', '🫂', '💪', '😢', '😂', '🔥', '🕊️', '💡'];
    if (!allowedReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction' });
    }

    const current = echo.reactionCounts.get(reaction) || 0;
    echo.reactionCounts.set(reaction, current + 1);
    echo.reactions.push(reaction);
    await echo.save();

    res.json({
      reactionCounts: Object.fromEntries(echo.reactionCounts),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSentimentStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const stats = await Echo.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$sentiment', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const enriched = stats.map((s) => ({
      sentiment: s._id,
      count: s.count,
      emoji: sentimentEmojis[s._id] || '💭',
      label: sentimentLabels.en[s._id] || s._id,
      percentage: total > 0 ? Math.round((s.count / total) * 100) : 0,
    }));

    res.json({ stats: enriched, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
