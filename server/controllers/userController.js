import User from "../models/User.js";
import bcrypt from "bcryptjs"; //Used for password hashing (security) external library
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import PendingUser from "../models/PendingUser.js";
import crypto from "crypto";//for tokens and data hashing built in library


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


// @desc Register user
// @route POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;//Extracting data from frontend request

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10); //Salt = random string added to password
    const hashedPassword = await bcrypt.hash(password, salt);//Salt = random string added to password
    
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
    _id: user._id,   //_id is auto-generated
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    role: user.role   // ⭐ added (default: user)
  },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =================************** LOGIN ******************************=================

// @desc Login user
// @route POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    //check if useremail verified or not . if not then user cannot login
    if (!user.isVerified) {
  return res.status(401).json({
    message: "Please verify your email first"
  });
}


    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // send response
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
    const { email, otp } = req.body;//Gets email and otp from request body

    const pendingUser = await PendingUser.findOne({ email });//Searches database for user with this email

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

export const forgotPassword = async (req, res) => {//async means it will handle database/email operations that take time.
  try {
    const { email } = req.body;//Extracts email from request body (

    // 1. find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 2. generate token
    const resetToken = crypto.randomBytes(32).toString("hex");//Creates a random secure token
    //randombytes 32 generated then converted by hexadecimal encoding


    // 3. hash token (security)
    //crypto->Built-in Node.js module->Used for security-related operations->Example: hashing, encryption, random values
    const hashedToken = crypto//Converts token into hashed form,We NEVER store plain reset tokens in DB (security risk)
      .createHash("sha256")//machine take input give output
      .update(resetToken)//take input 
      .digest("hex");//give output in hexadecimal form 

    // 4. save token + expiry
    user.resetPasswordToken = hashedToken;//Save Token in Database
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();//Updates user record in MongoDB.

    // 5. create reset link
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

    // 6. send email
    await sendEmail(
      email,
      "Password Reset Request",//this is subject
      `Click this link to reset your password: ${resetLink}`//this is message
    );

    res.json({
      message: "Password reset link sent to email"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//reset password logic

export const resetPassword = async (req, res) => {//req->data coming from frontend (password + token)
  try {
    const { password } = req.body;//password by user
    const { token } = req.params;//token from URL

    // 1. hash token from URL (must match DB format)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // 2. find user with valid token + not expired
    const user = await User.findOne({//Find user whose token matches AND is not expired
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }//gt means greater than
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }

    // 3. hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. remove reset fields
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
      .select("-password");//"Return everything EXCEPT password"

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