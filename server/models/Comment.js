import mongoose from "mongoose";//library used to interact with MongoDB in Node.js.

const commentSchema = new mongoose.Schema(//schema defines the structure of documents inside a MongoDB collection.
  {
    user: {//Stores who wrote the comment. It is NOT a name. It is a User ID from MongoDB.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",// means :- It connects to your User collection.(“This ObjectId belongs to the User collection”)
      required: true
    },

    userName: {//Stores the name of the user who wrote the comment.So frontend can show name without extra DB query.
      type: String,
      required: true
    },

    pdf: {//Tells which PDF this comment belongs to. It stores PDF ID
      type: mongoose.Schema.Types.ObjectId, //field definition object-->{} contain rules for text field
      ref: "PDF",
      required: true
    },

    text: {//This is the actual comment message
      type: String,
      required: true,
      trim: true//Removes extra spaces automatically
    }
  },
  { timestamps: true }//MongoDB automatically adds: createdAt → when comment was made ,updatedAt → when comment was edited
);

export default mongoose.model("Comment", commentSchema);