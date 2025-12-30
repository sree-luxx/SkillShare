const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || '',
      skillsHave: user.skillsHave || [],
      skillsWant: user.skillsWant || [],
      community: user.community || '',
      skills: user.skills || [],
      availabilitySlots: user.availabilitySlots || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, avatarUrl, skillsHave, skillsWant, community, availabilitySlots } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (skillsHave !== undefined) updateData.skillsHave = skillsHave;
    if (skillsWant !== undefined) updateData.skillsWant = skillsWant;
    if (community !== undefined) updateData.community = community;
    if (availabilitySlots !== undefined) updateData.availabilitySlots = availabilitySlots;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl || '',
      bio: user.bio || '',
      skillsHave: user.skillsHave || [],
      skillsWant: user.skillsWant || [],
      community: user.community || '',
      skills: user.skills || [],
      availabilitySlots: user.availabilitySlots || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

