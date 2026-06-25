import express from "express";
import { uploadResource , getResources,getResourceById , getCategories, getBooksByCategory,deleteResource,updateResource} from "../controllers/resourceController.js";//“When upload API is called, run this function”
import { protect , isAdmin} from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";  



const router = express.Router();

router.get("/",protect, getResources);
router.get("/categories", protect, getCategories);
router.get("/category/:name", protect, getBooksByCategory);
router.get("/:id", protect, getResourceById);
router.delete("/:id", protect, isAdmin, deleteResource);
router.put("/:id", protect, isAdmin, updateResource);


router.post("/upload", protect, upload.single("file"), uploadResource);



export default router; 



