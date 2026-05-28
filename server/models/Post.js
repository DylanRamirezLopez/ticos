const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['image', 'text'],
      default: 'image',
    },
    image: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
      maxlength: 10000,
    },
    caption: {
      type: String,
      default: '',
      maxlength: 2200,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    fileHash: {
      type: String,
      default: '',
    },
    fileMetadata: {
      type: Object,
      default: {},
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
