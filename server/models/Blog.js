import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 100,
  },
  textBody: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 1000,
  },
  image: {
    type: String, // Image is optional, so no required flag
  },
  creationDateTime: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deleteDateTime: {
    type: String,
    required: function () {
      return this.isDeleted;
    }, // Make deleteDateTime required if isDeleted is true
  },
  sentiment: {
    type: String,
    required: true, // Enforcing sentiment to always be present (if desired)
  },
  topic: {
    type: String,
    required: true, // Topic is a required field
    enum: [
      "Politics",
      "Technology",
      "Sports",
      "Health",
      "Education",
      "Entertainment",
    ],
    message: "{VALUE} is not a valid topic", // Custom error message
  },
});

export default mongoose.model("Blog", blogSchema);
