import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import path from 'path';
import url from 'url';

const getUserInfoById = async (req, res) => {
    try {
        // Extract JWT token from cookies
        const token = req.cookies.token || "";

        // If token is missing, return unauthorized error
        if (!token) {
            return res.status(401).json({
                message: "Session out",
                logout: true,
            });
        }

        // Verify the token and decode its payload
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        // Extract user ID from decoded token payload
        const userId = decoded._id;

        // Fetch user info based on the user ID from the token, excluding password
        const user = await userModel.findById(userId).select('-password');

        // If user is not found, return not found error
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        // Construct full URL for the avatar with correct path formatting
        const avatarUrl = user.avatar ? `${req.protocol}://${req.get('host')}/${user.avatar.replace(/\\/g, '/')}` : null;

        // Log user information
      //  console.log('from getUserInfo.js controller here is the user :', user);

        // Return user information in the response
        return res.status(200).json({
            error: false,
            data: { ...user.toObject(), avatarUrl },
            message: "User info",
        });

    } catch (error) {
        // Handle any errors that occur during execution
        console.log('from getUserInfo.js controller here is the error in catch :error :', error);

        return res.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

export default getUserInfoById;
