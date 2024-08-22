import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const createMessage = async (req, res) => {
  try {
    console.log('in createMessage', req.body);
    console.log('in createMessage here is the req/file', req.file);

    const { text, sender, conversationId, mediaType } = req.body;
    let media = '';
    let mediaUrl = '';

    if (req.file) {
      media = req.file.path.replace(/\\/g, '/'); // Get media file path from req.file
      mediaUrl = `http://localhost:5000/${media}`; // Generate media URL
    }

    // Validate that conversationId is provided
    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is required' });
    }

    // Create and save the new message
    const newMessage = new Message({
      text: text || '', // Default to empty string if no text
      sender,
      conversationId,
      media: media || '', // Save the media path
      mediaUrl: mediaUrl || '', // Save the media URL
      mediaType: mediaType || '' // Save media type (e.g., 'audio', 'image', 'video')
    });

    const savedMessage = await newMessage.save();

    // Fetch the conversation to update the seen status
    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      // Update seenStatus for all members, except for the sender
      const updatedSeenStatus = conversation.members.map(member => ({
        member,
        seen: member.toString() === sender.toString() // Sender's status should be true
      }));

      await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: savedMessage._id,
          seenStatus: updatedSeenStatus, // Set seenStatus to updated list
        }
      );

      res.status(200).json(savedMessage);
    } else {
      res.status(404).json({ message: 'Conversation not found' });
    }
  } catch (err) {
    console.log('Error from createMessage.js controller', err);
    res.status(500).json(err);
  }
};

export default createMessage;
