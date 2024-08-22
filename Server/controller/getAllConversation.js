import Conversation from "../models/conversationModel.js";

const getAllConversation = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all conversations where the user is a member
    const conversations = await Conversation.find({
      members: { $in: [userId] }
    })
    .populate({
      path: 'members',
      select: '-password',
      match: { _id: { $ne: userId } }
    })
    .populate('lastMessage');

    // Log conversations before modification
   // console.log('Conversations before adding avatarUrl:', JSON.stringify(conversations, null, 2));

    // Construct avatar URL for each member
    const updatedConversations = conversations.map(conversation => {
      if (conversation.members && conversation.members.length > 0) {
        conversation.members = conversation.members.map(member => {
          if (member.avatar) {
            const avatarUrl = `${req.protocol}://${req.get('host')}/${member.avatar.replace(/\\/g, '/')}`;
            console.log(`Generated avatarUrl for member ${member._id}: ${avatarUrl}`);
            member.avatarUrl = avatarUrl;
          } else {
            console.log(`No avatar for member ${member._id}`);
          }
          return member;
        });
      }
      return conversation;
    });

    // Log conversations after modification
   // console.log('Conversations after adding avatarUrl:', JSON.stringify(updatedConversations, null, 2));

    res.status(200).json(updatedConversations);
  } catch (err) {
    console.error('Error from getAllConversation.js controller', err); // Log any errors for debugging
    res.status(500).json(err);
  }
};

export default getAllConversation;
