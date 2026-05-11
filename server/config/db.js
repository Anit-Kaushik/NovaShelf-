import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();
//Loads variables from .env file into process.env

const connectDB = async () => {//Creates an async function to connect database
  try {
    await mongoose.connect(process.env.MONGO_URI);//Uses your connection string from .env to connect MongoDB
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;