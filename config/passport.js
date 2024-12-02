const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
                scope: ['read:user', 'repo'], // Add 'repo' scope to request access to private repos
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ githubId: profile.id });
                    if (!user) {
                        // Create a new user
                        user = await User.create({
                            githubId: profile.id,
                            name: profile.displayName || null,
                            avatar: profile.photos[0]?.value || null,
                            accessToken,
                            repositories: [],
                            experienceLevel: null, // Default value
                            expertise: null,       // Default value
                            techStack: [],         // Default value
                        });
                    } else {
                        // Update user's accessToken if they already exist
                        user.accessToken = accessToken;
                        await user.save();
                    }
                    return done(null, user);
                } catch (error) {
                    console.error('Error in GitHub strategy:', error);
                    return done(error, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
