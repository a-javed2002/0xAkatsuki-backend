const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.CALLBACK_URL,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ githubId: profile.id });
                    if (!user) {
                        user = await User.create({
                            githubId: profile.id,
                            name: profile.displayName,
                            avatar: profile.photos[0]?.value,
                            repositories: [], // Repositories can be fetched separately if needed
                        });
                    }
                    return done(null, user);
                } catch (error) {
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
            // Use async/await to handle Mongoose query
            const user = await User.findById(id).exec();
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
