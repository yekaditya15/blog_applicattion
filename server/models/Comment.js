import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
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
  parentCommentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  // Remove the replies array since we'll query them dynamically
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  depth: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
