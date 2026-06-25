import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"; 


export const uploadResource = async (req, res) => {  
  try {
    

    if (!req.file) {
      return res.status(400).json({
        message: "No file received. Use PDF file."
      });
    }    

    const { title, author, type,category } = req.body; 

    // upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { 
      resource_type: "raw",  
      type: "upload",        
      access_mode: "public",                   
    });

  
   
  


    fs.unlinkSync(req.file.path);

    // save in DB
    const resource = await Resource.create({
      title,   
      author,  
      type,    
      category,
      fileUrl: result.secure_url,  
      uploadedBy: req.user._id,   
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


export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
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