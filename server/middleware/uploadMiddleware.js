

import multer from "multer";  


const storage = multer.diskStorage({ 
  
    destination: (req, file, cb) => {
    cb(null, "uploads/");           
  },

  filename: (req, file, cb) => {  
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
 });  

export default upload;