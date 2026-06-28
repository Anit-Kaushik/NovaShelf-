import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "book",
        "pdf",
        "notes",
        "ebook",
        "assignment",
        "question-paper",
        "video",
      ],
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // Cloudinary public ID (used to delete PDF from Cloudinary)
    publicId: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resource", resourceSchema);