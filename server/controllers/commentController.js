import Comment from "../models/Comment.js";//import comment model from db so that we can create , read , delete , update it

// ADD COMMENT by user
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;//get comment from request body
    const pdfId = req.params.pdfId;//Gets PDF ID from URL

    const comment = await Comment.create({//create comment in db
      user: req.user._id,//logged in user
      userName: req.user.name,//loggged in user name 
      pdf: pdfId,
      text
    });

    res.status(201).json(comment);//Sends created comment back to frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS FOR A PDF
export const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;//Get page number from URL
    const limit = parseInt(req.query.limit) || 10;//How many comments to show per page

    const skip = (page - 1) * limit;//how many comments to skip

    const totalComments = await Comment.countDocuments({
      pdf: req.params.pdfId
    });

    const comments = await Comment.find({ pdf: req.params.pdfId })//fetch comments from db
      .sort({ createdAt: -1 })//lastest comment on top
      .skip(skip)//skip previous pgs comments
      .limit(limit);//only return fixed no. of comments

    res.json({
      comments,//send comments to frontend
      totalComments,//give total commands in db
      totalPages: Math.ceil(totalComments / limit),//how many pgs exist
      currentPage: page//current page user is on
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EDIT COMMENT (ONLY user)
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);//findById(used to get single document)-->Give me one specific comment using its unique ID
                                           //here id is comment id (not pdf id)
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {//Check: Is logged-in user owner? If NOT: 👉 block access
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;//UPDATE comment if provied else keep same comment
    await comment.save();//save new comment

    res.json(comment);//send updated comment back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT (OWNER OR ADMIN)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);//get single comment by comment id

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner =//“Is the logged-in user the same person who created this comment?”
      comment.user.toString() === req.user._id.toString();
      //comment.user means the user ID stored in the comment , user._id -->current logged in user 
    
    const isAdmin = req.user.role === "admin";//“Is the currently logged-in user an admin?”

    if (!isOwner && !isAdmin) {//“If the user is NOT the owner AND NOT an admin, then block them.”
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();//delete that comment

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};