import jwt from "jsonwebtoken"; //Imports JWT library. Used to verify token sent by user
import User from "../models/User.js";//Used to fetch user data from database


//create a middleware
export const protect = async (req, res, next) => { //This middleware runs before protected routes
  let token; //variable to store token

  // check token in header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {//"Check if user has sent a token, and make sure it's in correct format (Bearer token)"
    try {
      // get token
      token = req.headers.authorization.split(" ")[1];//Splits string "Bearer TOKEN" ->Takes second part (index 1)

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);//-->It does 2 main things:(i)Checks if token is real (not fake) , (ii)Checks if token is still valid (not expired)

    //  If token is valid, you get decoded={
    //                 id: "user_id_here",-->Used to identify user
    //                 iat: 1710000000,-->Time when token was created
    //                 exp: 1712592000-->Time when token will expire
    //                               }


// get user from DB (without password)
      req.user = await User.findById(decoded.id).select("-password");//-->return user object with decoded.id excluded password from object
      //req.user= means You are attaching user data to request object(in which user request)   
  

      next(); // allow access -->“Move to the next middleware or route handler”

    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });//“If token does NOT exist”
  }
};



//check whether user is admin or simple user if admin then can delete books from library
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Admin access only"
    });
  }
};