import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  blogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog", // Reference to the Blog model
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  creationDateTime: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
