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
    type: String,
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
  },
  sentiment: {
    type: String,
  },
  topic: {
    type: String,
    required: true,
    enum: [
      "Politics",
      "Technology",
      "Sports",
      "Health",
      "Education",
      "Entertainment",
    ],
    message: "{VALUE} is not a valid topic",
  },
});

export default mongoose.model("Blog", blogSchema);
