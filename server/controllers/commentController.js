import Comment from "../models/Comment.js";

// ADD COMMENT by user
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const pdfId = req.params.pdfId;

    const comment = await Comment.create({
      user: req.user._id,
      userName: req.user.name,
      pdf: pdfId,
      text
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS FOR A PDF
export const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalComments = await Comment.countDocuments({
      pdf: req.params.pdfId
    });

    const comments = await Comment.find({ pdf: req.params.pdfId }
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit));

    res.json({
      comments,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EDIT COMMENT (ONLY user)
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);//
                                           
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT (OWNER OR ADMIN)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner =
      comment.user.toString() === req.user._id.toString();
      
    
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};