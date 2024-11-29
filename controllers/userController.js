// backend/controllers/userController.js

const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        // Access the authenticated user's ID from req.user
        const user = await User.findById(req.user.id); // Make sure to use the ID stored in the JWT payload
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user profile data
        res.json({
            name: user.name,
            username: user.githubId, // Adjust this to how you store the GitHub username
            avatar: user.avatar,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        // Get the user's ID from the request
        const user = await User.findById(req.user.id); // Make sure to use req.user.id (set by authMiddleware)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile based on request body
        user.name = req.body.name || user.name;
        user.avatar = req.body.avatar || user.avatar;

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
