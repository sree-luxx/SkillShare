const User = require('../models/User');
const { preprocess, createVector, cosineSimilarity } = require('../utils/textAnalysis');

exports.getMatches = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // 1. Fetch current user
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Generate current user's semantic profile
    // Combine bio, skills, and interests into one text corpus
    const currentUserText = [
      currentUser.bio,
      ...(currentUser.skillsHave || []),
      ...(currentUser.skillsWant || []),
      ...(currentUser.interests || [])
    ].join(' ');

    const currentUserTokens = preprocess(currentUserText);
    const currentUserVector = createVector(currentUserTokens);

    // 3. Fetch potential matches (exclude self)
    // In a production app, you might limit this query or use a cursor
    const candidates = await User.find({ 
      _id: { $ne: currentUserId } 
    }).select('name avatarUrl bio skillsHave skillsWant interests');

    // 4. Calculate similarity scores
    const matches = candidates.map(candidate => {
      const candidateText = [
        candidate.bio,
        ...(candidate.skillsHave || []),
        ...(candidate.skillsWant || []),
        ...(candidate.interests || [])
      ].join(' ');

      const candidateTokens = preprocess(candidateText);
      const candidateVector = createVector(candidateTokens);
      
      const similarity = cosineSimilarity(currentUserVector, candidateVector);

      return {
        _id: candidate._id,
        name: candidate.name,
        avatarUrl: candidate.avatarUrl,
        bio: candidate.bio,
        skillsHave: candidate.skillsHave,
        interests: candidate.interests,
        matchScore: similarity
      };
    });

    // 5. Sort by score (highest first) and take top results
    // Filter out 0% matches if you want, or keep them
    const topMatches = matches
      .filter(m => m.matchScore > 0) // Only return relevant matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15);

    res.json(topMatches);

  } catch (error) {
    console.error('Error in AI matching:', error);
    res.status(500).json({ message: 'Server error during profile matching' });
  }
};
