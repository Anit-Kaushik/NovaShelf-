//Setup Multer (file upload)

import multer from "multer";  //Imports the Multer library ->“I want to handle file uploads from users (PDF, image, etc.)”

// store file temporarily -->Files will be stored temporarily on your server, not directly in cloud
const storage = multer.diskStorage({ // You are telling Multer: “Store uploaded files on disk (your local system)”
  
    destination: (req, file, cb) => {//You are telling Multer: 
    cb(null, "uploads/");            //“Save all uploaded files inside uploads/ folder”
  },

  filename: (req, file, cb) => {  //(How to name file)  formate in which file name will be ->help in Prevents duplicate file names (very important)
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};


const upload = multer({ storage,
  fileFilter
 });  //This creates a middleware -->“Use this storage setup whenever a file is uploaded”

export default upload;