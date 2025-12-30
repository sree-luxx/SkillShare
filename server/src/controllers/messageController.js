const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { peerId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: peerId },
        { sender: peerId, receiver: req.user._id }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
