import mongoose from "mongoose";

// Define the schema for conversations
const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: "User",
        required: true,
      }
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the last message in the conversation
      ref: "Message"
    },
    seenStatus: [
      {
        member: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        seen: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Create and export the model based on the schema
export default mongoose.model("Conversation", ConversationSchema);
