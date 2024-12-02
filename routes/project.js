const express = require('express');
const { getProjects, likeProject, dismissProject, searchProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();
const axios = require('axios');

router.get('/discover', getProjects);
router.post('/like/:id', likeProject);
router.post('/dismiss/:id', dismissProject);
router.get('/search', searchProjects);

// Protected route to fetch current user details
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        // Use req.user.id set by authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude sensitive data
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// // Route to fetch GitHub repositories
// router.get('/repos/', authMiddleware, async (req, res) => {
//     console.log("user id is " + req.user.id);
//     // Use req.user.id set by authMiddleware
//     const user = await User.findById(req.user.id).select('-password'); // Exclude sensitive data
//     if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//     }
//     console.log(user);
//     try {
//         const githubApiUrl = `https://api.github.com/user/${user.githubId}/repos`;
//         console.log("req the repos");
//         const response = await axios.get(githubApiUrl, {
//             headers: {
//                 'Authorization': `token ${user.accessToken}`, // Use a personal access token if needed
//             },
//         });
//         console.log(response.data);
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Failed to fetch repositories' });
//     }
// });

// Route to fetch GitHub repositories (including private ones)
router.get('/repos/', authMiddleware, async (req, res) => {
    console.log("user id is " + req.user.id);
    // Use req.user.id set by authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude sensitive data
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    console.log(user);

    try {
        // GitHub API URL for fetching all repositories (including private)
        const githubApiUrl = `https://api.github.com/user/repos?visibility=all`; // 'visibility=all' fetches both public and private repos
        console.log("Requesting the repos");

        // Make the request to GitHub API with the user's access token
        const response = await axios.get(githubApiUrl, {
            headers: {
                'Authorization': `token ${user.accessToken}`, // Use the stored access token for authentication
                'Accept': 'application/vnd.github.v3+json', // Ensure the correct API version
            },
        });

        console.log(response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch repositories' });
    }
});

// Route to fetch GitHub repositories (excluding the requester's repos)
router.get('/all-repos', authMiddleware, async (req, res) => {
    try {
        // Get the user ID from the request (set by the authMiddleware)
        const userId = req.user.id;

        // Fetch the user details from the database (exclude sensitive data like password)
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all users from the database except the one who made the request
        const otherUsers = await User.find({ _id: { $ne: userId } }).select('id accessToken');
        if (!otherUsers || otherUsers.length === 0) {
            return res.status(404).json({ message: 'No other users found' });
        }

        // Initialize an array to hold the repositories for all users except the requester
        const allRepos = [];

        // Loop through all other users and fetch their GitHub repositories
        for (const otherUser of otherUsers) {
            try {
                // GitHub API URL for fetching all repositories (including private ones)
                const githubApiUrl = `https://api.github.com/user/repos?visibility=all`;

                // Make the request to GitHub API using the user's access token
                const response = await axios.get(githubApiUrl, {
                    headers: {
                        'Authorization': `token ${otherUser.accessToken}`,
                        'Accept': 'application/vnd.github.v3+json',  // Ensure the correct API version
                    },
                });

                // Push the repositories into the result array
                allRepos.push({
                    userId: otherUser.id,
                    repos: response.data,
                });
            } catch (error) {
                console.error(`Failed to fetch repos for user ${otherUser.id}: ${error.message}`);
                continue;  // Skip to the next user on error
            }
        }

        // Respond with the repositories data
        res.status(200).json(allRepos);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to fetch repositories' });
    }
});



module.exports = router;
