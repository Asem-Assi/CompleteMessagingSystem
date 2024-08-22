import userModel from '../models/userModel.js';


const search= async (req, res) => {
  const { searchKey } = req.body;

  if (!searchKey) {
    return res.status(400).json({
      error: true,
      message: 'Search key is required',
    });
  }

  try {
    const regex = new RegExp(searchKey, 'i'); // 'i' makes it case-insensitive
    const users = await userModel.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    }).select('-password');

    return res.status(200).json({
      error: false,
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.log('here is the error from search.js controller',error);
    return res.status(500).json({
      error: true,
      message: error.message || 'Internal Server Error',
    });
  }
};

export default search;
