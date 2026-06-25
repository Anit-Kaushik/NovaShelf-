import express from "express";
import {
  addComment,
  getComments,
  editComment,
  deleteComment
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// public (any logged-in user)
router.get("/:pdfId", getComments);

// protected routes
router.post("/:pdfId", protect, addComment);//“Add a comment to a PDF”
router.put("/:id", protect, editComment);//edit a specific comment 
router.delete("/:id", protect, deleteComment);//“Delete a comment by ID”

export default router;