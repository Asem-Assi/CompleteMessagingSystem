// models/messageModel.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Conversation model
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    text: {
      type: String, // Message text content
      required: false, // Not required, since messages can be media only
    },
    media: {
      type: String, // URL or path to the media file
      required: false, // Not required, since messages can be text only
    },
    mediaUrl: {
      type: String, // URL to the media file
      required: false, // Not required, since messages can be text only
    },
    mediaType: {
      type: String, // Type of the media (e.g., 'image', 'video', 'audio')
      required: false, // Not required, since messages can be text only
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

export default mongoose.model("Message", MessageSchema);
