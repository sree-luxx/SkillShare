const mongoose = require('mongoose');

const reactionTypes = ['like', 'love', 'celebrate', 'insightful', 'funny'];

const communityPostSchema = new mongoose.Schema({
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  reactions: {
    like: { type: Number, default: 0 },
    love: { type: Number, default: 0 },
    celebrate: { type: Number, default: 0 },
    insightful: { type: Number, default: 0 },
    funny: { type: Number, default: 0 }
  },
  userReactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, enum: reactionTypes }
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' }
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
