import Resource from "../models/Resource.js";//Imports your MongoDB model-->“I will use this to store book/PDF data in database”
import cloudinary from "../config/cloudinary.js";//  so that “I can now upload files to cloud”
import fs from "fs";    //Built-in Node.js module-->“I can delete files from my server”

// @desc Upload resource (PDF)
// @route POST /api/resources/upload
// @access Private
export const uploadResource = async (req, res) => {  //“This runs when user uploads a file”
  try {
    

    if (!req.file) {
      return res.status(400).json({
        message: "No file received. Use PDF file."
      });
    }    

    const { title, author, type,category } = req.body; //Extracts data sent from frontend 

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { //(i)cloudinary 👉 This is your configured Cloudinary object (ii).uploader 👉 A module inside Cloudinary (iii).upload() 👉 Function that uploads file to cloud
      resource_type: "raw",  
      type: "upload",        // ✅ ensures public delivery
      access_mode: "public",                   //req.file.path--> File path from Multer(from uploads folder in server)
    });

   //here result= It returns a big object.  result.secure_url 👉 This is your final file link 
   
  

// delete local file-->Deletes file from uploads/
    fs.unlinkSync(req.file.path);

    // save in DB
    const resource = await Resource.create({//Creates a new document in MongoDB
      title,   //From user input
      author,  //From user input
      type,    //From user input
      category,
      fileUrl: result.secure_url,  //Cloudinary file link
      uploadedBy: req.user._id,   //User ID (from auth middleware)
    });

    res.status(201).json({
      message: "File uploaded successfully",
      resource,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(req.file);
  }
};

// @desc Get all resources
// @route GET /api/resources
// @access Public
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();//Gets all resources/books from MongoDB.
    res.json(resources);//sends all books as JSON response.
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get books by id params
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(resource);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


//search book by keyword

// export const searchResources = async (req, res) => {
//   try {
//     const keyword = req.query.keyword;

//     const resources = await Resource.find({
//       $or: [
//         { title: { $regex: keyword, $options: "i" } },
//         { author: { $regex: keyword, $options: "i" } }
//       ]
//     });

//     res.json(resources);

//   } catch (error) {
//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

//get all categories of books in sorting order from A to Z
export const getCategories = async (req, res) => {
  try {
    const categories = await Resource.distinct("category");
    categories.sort();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//get books of a specific category like dsa by query parameters
export const getBooksByCategory = async (req, res) => {
  try {
    const books = await Resource.find({
      category: req.params.name
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//for deleting book
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    await resource.deleteOne();

    res.json({
      message: "Book deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


//for updating book details
export const updateResource = async (req, res) => {
  try {
    const { title, author, category, type } = req.body;

    const resource = await Resource.findById(req.params.id);//id is book id which we want to update

    if (!resource) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    resource.title = title || resource.title;
    resource.author = author || resource.author;
    resource.category = category || resource.category;
    resource.type = type || resource.type;

    const updatedResource = await resource.save();//save these changes in book info

    res.json({
      message: "Book updated successfully",
      updatedResource//return updated book details
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};