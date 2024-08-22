import userModel from "../models/userModel.js";

const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userModel.findById(userId).select('-password'); // Select only necessary fields
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error('Error retrieving user from getUserFromId.js controller: ', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  export default getUserById