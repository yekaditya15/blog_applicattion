import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isEmailVerified: { type: Boolean, default: false },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
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
});

export default mongoose.model("User", userSchema);
