import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ================= Upload Resource =================

export const uploadResource = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required",
      });
    }

    const { title, author, type, category } = req.body;

    // ---------- Validation ----------
    if (
      !title?.trim() ||
      !author?.trim() ||
      !type?.trim() ||
      !category?.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ---------- Upload to Cloudinary ----------
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "raw",
      }
    );

    // ---------- Save to DB ----------
    const resource = await Resource.create({
      title: title.trim(),
      author: author.trim(),
      type: type.trim(),
      category: category.trim(),
      fileUrl: result.secure_url,
      publicId: result.public_id || null,
      uploadedBy: req.user._id,
    });

    return res.status(201).json({
      message: "Resource uploaded successfully",
      resource,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      message: "Server error while uploading resource",
    });
  } finally {
    // ---------- Cleanup temp file ----------
    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (err) {
      console.log("File cleanup error:", err.message);
    }
  }
};

// ================= Get All Resources =================

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email");

    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resources",
    });
  }
};

// ================= Get Resource By ID =================

export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    return res.status(200).json(resource);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resource",
    });
  }
};

// ================= Get Categories =================

export const getCategories = async (req, res) => {
  try {
    const categories = await Resource.distinct("category");

    return res.status(200).json(categories.sort());
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
};

// ================= Get By Category =================

export const getBooksByCategory = async (req, res) => {
  try {
    const books = await Resource.find({
      category: req.params.name,
    }).sort({ createdAt: -1 });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch category resources",
    });
  }
};

// ================= Delete Resource =================

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    // Delete from Cloudinary
    if (resource.publicId) {
      await cloudinary.uploader.destroy(resource.publicId, {
        resource_type: "raw",
      });
    }

    await resource.deleteOne();

    return res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete resource",
    });
  }
};

// ================= Update Resource =================

export const updateResource = async (req, res) => {
  try {
    const { title, author, category, type } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    resource.title = title?.trim() || resource.title;
    resource.author = author?.trim() || resource.author;
    resource.category = category?.trim() || resource.category;
    resource.type = type?.trim() || resource.type;

    const updatedResource = await resource.save();

    return res.status(200).json({
      message: "Resource updated successfully",
      updatedResource,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update resource",
    });
  }
};