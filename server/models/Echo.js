const mongoose = require('mongoose');

const echoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    sentiment: {
      type: String,
      enum: [
        'happy', 'sad', 'angry', 'anxious', 'loved',
        'lonely', 'hopeful', 'grateful', 'stressed', 'excited',
        'tired', 'confused', 'neutral',
      ],
      default: 'neutral',
    },
    reactions: [
      {
        type: String,
        enum: ['❤️', '🫂', '💪', '😢', '😂', '🔥', '🕊️', '💡'],
      },
    ],
    reactionCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Echo',
      default: null,
    },
    replyCount: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

echoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
echoSchema.index({ createdAt: -1 });
echoSchema.index({ sentiment: 1, createdAt: -1 });

module.exports = mongoose.model('Echo', echoSchema);
