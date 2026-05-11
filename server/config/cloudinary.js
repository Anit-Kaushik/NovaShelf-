import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary"; //Imports Cloudinary library from the Cloudinary package

cloudinary.config({ //You are telling Cloudinary: “Here are my credentials, connect me to my account”
  cloud_name: process.env.CLOUD_NAME, //“Use this cloud (my account/project)”
  api_key: process.env.CLOUD_API_KEY, //Identifies your app ->“This request is coming from my app”
  api_secret: process.env.CLOUD_API_SECRET, //Secret authentication (like password) ->“Yes, I am authorized to use this account”
});

console.log("env");
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUD_API_KEY);
console.log(process.env.CLOUD_API_SECRET);

export default cloudinary;  //Meaning: “Use this ready-to-use Cloudinary anywhere in my project”