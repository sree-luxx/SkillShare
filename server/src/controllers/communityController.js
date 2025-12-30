const Community = require('../models/Community');

const PREDEFINED_SKILLS = [
  'Web Development',
  'Design',
  'Data Science',
  'Machine Learning',
  'Business',
  'Cloud',
  'Cybersecurity',
  'Mobile',
  'DevOps'
];

exports.createCommunity = async (req, res) => {
  try {
    const {
      communityName,
      primarySkill,
      description,
      purpose,
      visibility,
      guidelines,
      status,
      bannerUrl,
      logoUrl,
      tags,
      requiresJoinApproval,
      requiresPostApproval
    } = req.body;

    if (!communityName || !primarySkill || !description || !purpose || !visibility || !guidelines) {
      return res.status(400).json({ message: 'All mandatory fields are required' });
    }

    if (!PREDEFINED_SKILLS.includes(primarySkill)) {
      return res.status(400).json({ message: 'Invalid primary skill' });
    }

    const exists = await Community.findOne({ communityName });
    if (exists) return res.status(400).json({ message: 'Community name already exists' });

    const normalizedTags =
      Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' && tags.trim() !== '' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const community = await Community.create({
      communityName,
      primarySkill,
      description,
      purpose,
      visibility,
      guidelines,
      createdBy: req.user._id,
      status: status || 'Active',
      bannerUrl: bannerUrl || '',
      logoUrl: logoUrl || '',
      moderators: [req.user._id],
      tags: normalizedTags,
      requiresJoinApproval: Boolean(requiresJoinApproval),
      requiresPostApproval: Boolean(requiresPostApproval)
    });

    res.status(201).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listCommunities = async (_req, res) => {
  try {
    const communities = await Community.find().sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    if (String(community.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this community' });
    }
    await Community.deleteOne({ _id: id });
    res.json({ message: 'Community deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
