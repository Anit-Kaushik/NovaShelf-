import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  type: {
    type: String,
    enum: [ "book",
    "pdf",
    "notes",
    "ebook",
    "assignment",
    "question-paper",
    "video"], // only these allowed
    required: true,
  },
  category: {
  type: String,
  required: true
},
  fileUrl: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
}, { timestamps: true });

export default mongoose.model("Resource", resourceSchema);