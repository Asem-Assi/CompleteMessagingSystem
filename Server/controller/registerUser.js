import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.path : ''; // Get avatar file path from req.file
    const avatarUrl = req.file ? `http://localhost:5000/${req.file.path}` : ''; // Generate avatarUrl

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        message: "User already exists",
        error: true
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const payload = { name, email, password: hashedPassword, avatar, avatarUrl }; // Include avatarUrl
    const newUser = new userModel(payload);
    const savedUser = await newUser.save();

    return res.status(200).json({
      message: "User created successfully",
      error: false
    });
  } catch (error) {
    console.error('Error from registerUser.js controller:', error);
    return res.status(500).json({
      error: true,
      message: error.message || "Internal server error"
    });
  }
};

export default register;
