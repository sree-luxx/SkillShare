const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityName: { type: String, required: true, unique: true, trim: true },
  primarySkill: { type: String, required: true },
  description: { type: String, required: true },
  purpose: { type: String, enum: ['Learn', 'Teach', 'Learn & Teach', 'Collaborate'], required: true },
  visibility: { type: String, enum: ['Public', 'Private', 'Request-based'], required: true },
  guidelines: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  bannerUrl: { type: String, default: '' },
  logoUrl: { type: String, default: '' },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  tags: { type: [String], default: [] },
  requiresJoinApproval: { type: Boolean, default: false },
  requiresPostApproval: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
