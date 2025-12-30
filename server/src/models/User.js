const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  skillsHave: { type: [String], default: [] },
  skillsWant: { type: [String], default: [] },
  bio: { type: String, default: '' },
  community: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  isPrivate: { type: Boolean, default: false },
  peers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  availabilitySlots: [{ type: Date }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
