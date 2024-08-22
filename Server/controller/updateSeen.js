import Conversation from "../models/conversationModel.js";

const updateSeenStatus = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;

    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Update the seen status for the user
    const statusIndex = conversation.seenStatus.findIndex(
      status => status.member.toString() === userId.toString()
    );

    if (statusIndex > -1) {
      conversation.seenStatus[statusIndex].seen = true;
    } else {
      conversation.seenStatus.push({ member: userId, seen: true });
    }

    // Save the updated conversation
    await conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    console.error('Error updating seen status:', err);
    res.status(500).json(err);
  }
};

export default updateSeenStatus;
