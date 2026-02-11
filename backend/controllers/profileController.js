const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { fullName, dob, sex, qualification, photo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName,
        dob,
        sex,
        qualification,
        photo
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};
