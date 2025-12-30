const Community = require('../models/Community');
const CommunityPost = require('../models/CommunityPost');

exports.listByCommunity = async (req, res) => {
  try {
    const { name } = req.params;
    const community = await Community.findOne({ communityName: name });
    if (!community) return res.status(404).json({ message: 'Community not found' });

  const posts = await CommunityPost.find({ community: community._id, status: 'approved' })
      .populate('author', 'name avatarUrl')
      .populate('comments.user', 'name avatarUrl')
      .sort({ createdAt: -1 });

  const formatted = posts.map(p => ({
    id: p._id,
    author: { id: p.author._id, name: p.author.name, avatarUrl: p.author.avatarUrl || '' },
    content: p.content,
    imageUrl: p.imageUrl || '',
    reactions: p.reactions,
    comments: (p.comments || []).map(c => ({
      author: { id: c.user?._id, name: c.user?.name || 'Member', avatarUrl: c.user?.avatarUrl || '' },
      text: c.text,
      createdAt: c.createdAt
    })),
    createdAt: p.createdAt
  }));
  res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { communityName, content, imageUrl } = req.body;
    if (!communityName) return res.status(400).json({ message: 'communityName required' });
    if (!content && !imageUrl) return res.status(400).json({ message: 'Post must have text or image' });

    const community = await Community.findOne({ communityName });
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const status = community.requiresPostApproval ? 'pending' : 'approved';
    const post = await CommunityPost.create({
      community: community._id,
      author: req.user._id,
      content: content || '',
      imageUrl: imageUrl || '',
      status
    });

    const populated = await post.populate('author', 'name avatarUrl');
    res.status(201).json({
      id: populated._id,
      author: { id: populated.author._id, name: populated.author.name, avatarUrl: populated.author.avatarUrl || '' },
      content: populated.content,
      imageUrl: populated.imageUrl || '',
      reactions: populated.reactions,
      status: populated.status,
      createdAt: populated.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.react = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const allowed = ['like', 'love', 'celebrate', 'insightful', 'funny'];
    if (!allowed.includes(type)) return res.status(400).json({ message: 'Invalid reaction' });

    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.status === 'pending') return res.status(400).json({ message: 'Cannot react to pending posts' });

    const existingIndex = post.userReactions.findIndex(r => String(r.user) === String(req.user._id));
    if (existingIndex >= 0) {
      const prevType = post.userReactions[existingIndex].type;
      if (prevType === type) {
        post.reactions[type] = Math.max(0, (post.reactions[type] || 0) - 1);
        post.userReactions.splice(existingIndex, 1);
      } else {
        post.reactions[prevType] = Math.max(0, (post.reactions[prevType] || 0) - 1);
        post.userReactions[existingIndex].type = type;
        post.reactions[type] = (post.reactions[type] || 0) + 1;
      }
    } else {
      post.userReactions.push({ user: req.user._id, type });
      post.reactions[type] = (post.reactions[type] || 0) + 1;
    }

  await post.save();
  res.json({ reactions: post.reactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();
    const populated = await post.populate('comments.user', 'name avatarUrl');
    const comments = populated.comments.map(c => ({
      author: { id: c.user?._id, name: c.user?.name || 'Member', avatarUrl: c.user?.avatarUrl || '' },
      text: c.text,
      createdAt: c.createdAt
    }));
    res.status(201).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
