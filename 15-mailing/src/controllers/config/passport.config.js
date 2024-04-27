const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");

passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });

            if (!user) {
                return done(null, false, { message: "Invalid email" });
            }

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Invalid password" });
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.use(new GitHubStrategy(
    {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ githubId: profile.id });

            if (user) {
                return done(null, user);
            } else {
                const newUser = new userModel({
                    githubId: profile.id,
                    username: profile.username,
                });

                await newUser.save();
                return done(null, newUser);
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
