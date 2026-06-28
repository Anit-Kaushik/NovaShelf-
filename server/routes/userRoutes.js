import express from "express";
import { registerUser,loginUser, verifyEmail ,forgotPassword,resetPassword,getAllUsers, deleteUser} from "../controllers/userController.js"; 
import { protect ,isAdmin} from "../middleware/authMiddleware.js";



const router = express.Router(); 


router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});





router.post("/register", registerUser); 
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);


router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get("/", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router; 