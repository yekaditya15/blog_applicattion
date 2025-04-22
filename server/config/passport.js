import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google strategy callback called");
      console.log("Profile:", profile.id, profile.displayName);

      try {
        // Check if user already exists in our database
        let user = await User.findOne({ googleId: profile.id });
        console.log("Existing user found:", !!user);

        if (user) {
          // User exists, return the user
          return done(null, user);
        }

        // Generate a unique username based on Google profile
        const baseUsername = profile.displayName
          .toLowerCase()
          .replace(/\s+/g, "");
        let username = baseUsername;
        let usernameExists = true;
        let counter = 0;

        // Keep checking until we find a unique username
        while (usernameExists) {
          const existingUser = await User.findOne({ username });
          if (!existingUser) {
            usernameExists = false;
          } else {
            counter++;
            username = `${baseUsername}${counter}`;
          }
        }

        // Create a new user
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          username: username,
          isEmailVerified: true, // Google already verified the email
          gender: "Other", // Default value, can be updated by user later
          profilePicture: profile.photos[0].value,
          authProvider: "google",
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
