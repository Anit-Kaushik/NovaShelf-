import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userName: {
      type: String,
      required: true
    },

    pdf: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PDF",
      required: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);