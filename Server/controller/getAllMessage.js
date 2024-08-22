import Message from '../models/messageModel.js';

const getAllMessages = async (req, res) => {
  try {
    const { conversationId, page = 1, limit = 10 } = req.query; // page and limit from query parameters

    // Validate the conversationId
    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is required' });
    }

    // Fetch messages with pagination
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit) // Skip messages based on page
      .limit(Number(limit)) // Limit the number of messages
      .exec();

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error from getAllMessages.js controller', err);
    res.status(500).json(err);
  }
};

export default getAllMessages;
