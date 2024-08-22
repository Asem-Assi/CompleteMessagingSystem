import Conversation from "../models/conversationModel.js";
const createConversation= async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      console.log('error from createConversation.js controller',err)
      res.status(500).json({ error: err.message });
    }
  };
  export default createConversation
  