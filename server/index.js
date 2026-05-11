import dotenv from "dotenv";
dotenv.config();

import express from "express"; // Import Express library👉 Now we can use it to create server



import cors from "cors";
//import cors so that frontend can access backend

import testRoutes from "./routes/testRoutes.js";

import resourceRoutes from "./routes/resourceRoutes.js";

import commentRoutes from "./routes/commentRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import connectDB from "./config/db.js"; // ✅ Import DB connection



const app=express();  //Create server instance👉 Think:“app = my backend server”

connectDB(); // ✅ connectDB() must run: Before handling requests Before server starts accepting traffic  Otherwise: ❌ Your API may run without database connection



//***********************************MIDDLEWARES**************************************

app.use(cors()); //enable cors for all requests without this frontend cannot call api
app.use(express.json());//line allows backend to read json 



// app.get("/",(req,res)=>{
//     res.send("api is running ...");
// });    app.get() → API route  / → homepage route   (req, res):req → request (data from user)  res → response (what we send back)

// app.get("/api/test",(req,res)=>{
//     res.json({message:"backend is connected"});  Now your backend has an API:GET  http://localhost:5000/api/test
// });

//***********************************MIDDLEWARES*************************************** */

//************************************ROUTES********************************************

app.use("/api",testRoutes);

// Think like this:

// app.use("/api", testRoutes);
// = “Send all /api traffic to this(testRoutes) department”
// router.get("/test")
// = “Handle /test request inside that(testRoutes) department”

app.use("/api/users", userRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/comments", commentRoutes);



//****************************************ROUTES*********************************************** */

const PORT = 5000;//server run on this port\

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`);
});  //Starts server  that Listens for incoming requests