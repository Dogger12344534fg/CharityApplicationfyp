import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../modules/users/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:1000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // Find existing user by email
        let user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          // Existing user — update avatar if they don't have one
          if (!user.avatar?.url && avatar) {
            user.avatar = { url: avatar, publicId: null };
            await user.save();
          }
          return done(null, user);
        }

        // New user — create account (no password needed for Google users)
        user = await User.create({
          name,
          email: email.toLowerCase(),
          password: `google_oauth_${profile.id}`, // placeholder — can never log in with this
          avatar: avatar ? { url: avatar, publicId: null } : undefined,
          googleId: profile.id,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// Not using sessions — just needed for passport internals
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
