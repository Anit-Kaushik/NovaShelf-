import express from "express";
import {
  uploadResource,
  getResources,
  getResourceById,
  getCategories,
  getBooksByCategory,
  deleteResource,
  updateResource,
} from "../controllers/resourceController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =======================
        USER ROUTES
======================= */

// Get all resources
router.get("/", protect, getResources);

// Get all categories
router.get("/categories", protect, getCategories);

// Get resources by category
router.get("/category/:name", protect, getBooksByCategory);

// Get single resource
router.get("/:id", protect, getResourceById);

/* =======================
        ADMIN ROUTES
======================= */

// Upload PDF
router.post(
  "/upload",
  protect,
  isAdmin,
  upload.single("file"),
  uploadResource
);

// Update resource
router.put("/:id", protect, isAdmin, updateResource);

// Delete resource
router.delete("/:id", protect, isAdmin, deleteResource);

export default router;