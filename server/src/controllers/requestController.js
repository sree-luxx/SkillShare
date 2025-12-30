const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.sendRequest = async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    const fromUserId = req.user._id;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const existingRequest = await Request.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already pending" });
    }

    const request = new Request({
      fromUser: fromUserId,
      toUser: toUserId,
      message
    });

    await request.save();

    // Create notification for the recipient
    await Notification.create({
      user: toUserId,
      type: 'request_received',
      message: `You received a skill swap request from ${req.user.name}`,
      relatedUser: req.user._id
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequestsMade = async (req, res) => {
  try {
    const requests = await Request.find({ fromUser: req.user._id })
      .populate('toUser', 'name avatarUrl bio skillsHave community')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(req => ({
      id: req._id,
      requestId: req._id,
      userId: req.toUser._id,
      name: req.toUser.name,
      avatar: req.toUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.toUser.name}`,
      bio: req.toUser.bio,
      skillsHave: req.toUser.skillsHave,
      primarySkill: req.toUser.skillsHave?.[0] || "General",
      rating: 5.0,
      community: req.toUser.community,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.withdrawRequest = async (req, res) => {
  try {
    const request = await Request.findOneAndDelete({
      _id: req.params.id,
      fromUser: req.user._id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found or not pending" });
    }

    res.json({ message: "Request withdrawn" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRequestsReceived = async (req, res) => {
  try {
    const requests = await Request.find({ toUser: req.user._id })
      .populate('fromUser', 'name avatarUrl bio skillsHave community')
      .sort({ createdAt: -1 });

    const formattedRequests = requests.map(req => ({
      id: req._id,
      requestId: req._id,
      userId: req.fromUser._id,
      name: req.fromUser.name,
      avatar: req.fromUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.fromUser.name}`,
      bio: req.fromUser.bio,
      skillsHave: req.fromUser.skillsHave,
      primarySkill: req.fromUser.skillsHave?.[0] || "General",
      rating: 5.0,
      community: req.fromUser.community,
      status: req.status,
      message: req.message,
      createdAt: req.createdAt
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findOne({
      _id: req.params.id,
      toUser: req.user._id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found or not pending" });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Add to peers lists
      await User.findByIdAndUpdate(request.fromUser, { $addToSet: { peers: request.toUser } });
      await User.findByIdAndUpdate(request.toUser, { $addToSet: { peers: request.fromUser } });

      // Notify the sender
      await Notification.create({
        user: request.fromUser,
        type: 'request_accepted',
        message: `${req.user.name} accepted your skill swap request!`,
        relatedUser: req.user._id
      });
    }

    res.json({ message: `Request ${status}`, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
