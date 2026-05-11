import express from "express"; //used to create APIs and handle routes
import { registerUser,loginUser, verifyEmail ,forgotPassword,resetPassword,getAllUsers, deleteUser} from "../controllers/userController.js"; //Importing your registerUser function
import { protect ,isAdmin} from "../middleware/authMiddleware.js";//Imports your authentication middleware This middleware checks:Token exists ✅ Token is valid ✅ User exists ✅

//Separation of concerns:Routes → define endpoints , Controllers → contain logic

const router = express.Router(); //Creating a mini router object


router.get("/profile", protect, (req, res) => {//Only users with a valid token can access this route. Without protect middleware, anyone could call: GET /profile and see user data
  res.json(req.user);
});

// After middleware runs:  req.user is available everywhere
// You can:use req.user._id ,req.user.email
// ✔ No need to query DB again

//“For every route that should be accessed only by logged-in users, we attach a middleware (protect). If the middleware successfully verifies the user, it calls next() and access is granted. Otherwise, it blocks the request.”



router.post("/register", registerUser); //When client sends a POST request ->To URL: /register -> Then run → registerUser function
router.post("/login", loginUser);// When client sends a POST request ->To URL: /login -> Then run → loginUser function
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);//reset password route

router.get("/", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router; //Exporting router so it can be used in main server file