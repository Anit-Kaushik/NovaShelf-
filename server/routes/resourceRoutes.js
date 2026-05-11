import express from "express";//create routes (APIs) using Express
import { uploadResource , getResources,getResourceById , getCategories, getBooksByCategory,deleteResource,updateResource} from "../controllers/resourceController.js";//“When upload API is called, run this function”
import { protect , isAdmin} from "../middleware/authMiddleware.js";//"middlewware for authontication ->Only logged-in users can access this route”
import upload from "../middleware/uploadMiddleware.js";   //“Handle file upload before reaching controller” means store it in uploads local folder



const router = express.Router();//Creates a mini route handler

router.get("/",protect, getResources);//get all resoureces/books at this route
router.get("/categories", protect, getCategories);//get categories
router.get("/category/:name", protect, getBooksByCategory);//get books of a specific category
router.get("/:id", protect, getResourceById);//get book by id .note:-If /:id comes first,"categories" may be treated as an id
router.delete("/:id", protect, isAdmin, deleteResource);
router.put("/:id", protect, isAdmin, updateResource);//only admin can update info


router.post("/upload", protect, upload.single("file"), uploadResource);// protect runs first-->“Check if user is logged in
//upload.single("file")-->Multer middleware -->“Accept ONE file from field name = 'file'”


export default router; //Makes this route usable in main server



// Step-by-step:
// Request hits /upload
// ✅ protect → checks login
// ✅ upload.single() → saves file locally
// ✅ uploadResource → uploads to cloud + saves DB