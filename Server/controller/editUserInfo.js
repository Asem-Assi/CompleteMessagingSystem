import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const editUser = async (req, res) => {
  try {
    const token = req.cookies.token || "";

    if (!token) {
      return res.status(401).json({
        message: "Session out",
        logout: true,
      });
    }

    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const userId = decoded._id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const { name, email, password } = req.body;
    const avatar = req.file ? req.file.path : user.avatar; // Use existing avatar if not updated
    const avatarUrl = req.file ? `http://localhost:5000/${req.file.path}` : user.avatarUrl; // Generate or keep existing avatarUrl

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    user.avatar = avatar;
    user.avatarUrl = avatarUrl; // Update avatarUrl

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      error: false
    });

  } catch (error) {
    console.error('Error from editUser.js controller:', error);
    return res.status(500).json({
      error: true,
      message: error.message || "Internal server error"
    });
  }
};

export default editUser;
