import User from "../models/User.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import PendingUser from "../models/PendingUser.js";
import crypto from "crypto";




// generate token
const generateToken = (id,role) => {
  return jwt.sign({
             id,
             role 
    }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};


// =================*************** REGISTER ******************************=================


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    
      // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

const user = await PendingUser.findOneAndUpdate(
  { email },

  {
    name,
    email,
    password: hashedPassword,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000,
    isVerified: false
  },

  {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  }
);


     // send email
    await sendEmail(
      email,
      "Verify Your Email",
      `Your verification code is: ${otp}`
    );

    res.status(201).json({
      message: "Please enter the OTP sent to your email.",
      user: {
    _id: user._id,   
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    role: user.role   
  },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =================************** LOGIN ******************************=================


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    
    if (!user.isVerified) {
  return res.status(401).json({
    message: "Please verify your email first"
  });
}


    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

   
    res.json({
      message: "Login successful",
      token: generateToken(user._id,user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role   // ⭐ important for frontend + auth
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




//get otp from user and compare with send otp only then user is verified

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({ email });

     if (!pendingUser) {
      return res.status(404).json({
        message: "No pending registration found"
      });
    }

    

    if (pendingUser.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }


     if (pendingUser.otpExpires < Date.now()) {
      await PendingUser.deleteOne({ email });

   return res.status(400).json({
      message: "OTP expired. Please register again."
   });
    }

    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true
    });

    await PendingUser.deleteOne({ email });

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


//forget password logic

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    const resetToken = crypto.randomBytes(32).toString("hex");
 


    
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken) 
      .digest("hex");

   
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    await user.save();

    console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    
    await sendEmail(
      email,
      "Password Reset Request",
      `Click this link to reset your password: ${resetLink}`
    );

    res.json({
      message: "Password reset link sent to email"
    });

  } catch (error) {
  console.error("Forgot Password Error:", error);

  res.status(500).json({
    message: error.message,
  });
}
};


//reset password logic

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

   
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }

   
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

   
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password");

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch users"
    });

  }
};



export const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete user"
    });

  }
};