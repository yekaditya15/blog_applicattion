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
    type: String,
    required: true,
  },
});

export default mongoose.model("Comment", commentSchema);
