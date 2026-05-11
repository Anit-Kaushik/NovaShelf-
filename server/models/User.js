import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {             //Defines the name field
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {    //Important: 👉 You will store encrypted password here (not plain text)
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isVerified: {//user approved or not
      type: Boolean,
      default: false
    },
  resetPasswordToken: String,//A temporary secret code stored in database
  resetPasswordExpire: Date,//A time limit for reset token
    
   }, 
{ timestamps: true });  //This adds automatic fields Meaning:When user created,When user updated

export default mongoose.model("User", userSchema); //This creates a Model 

// "User" → collection name (MongoDB creates users)
// userSchema → structure