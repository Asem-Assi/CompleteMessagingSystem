import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'provide a name'] },
    email: { type: String, required: [true, 'provide an email'], unique: true },
    password: { type: String, required: [true, 'provide a password'] },
    avatar: { type: String, default: '' },
    avatarUrl: { type: String, default: '' } // Add this field
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('User', userSchema);

export default userModel;
