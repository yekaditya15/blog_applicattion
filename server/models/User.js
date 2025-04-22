import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false, select: false }, // Made password optional for OAuth users
  isEmailVerified: { type: Boolean, default: false },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "NA"],
    required: true,
    default: "Other",
  },
  topics: [
    {
      type: String,
      enum: [
        "Politics",
        "Technology",
        "Sports",
        "Health",
        "Education",
        "Entertainment",
      ],
    },
  ],
  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  authProvider: { type: String, enum: ["local", "google"], default: "local" },
});

export default mongoose.model("User", userSchema);
