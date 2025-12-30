const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPeers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('peers', 'name avatarUrl bio');
    res.json(user.peers || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
