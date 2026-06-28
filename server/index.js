import dotenv from "dotenv";
dotenv.config();

import express from "express";

import cors from "cors";



import resourceRoutes from "./routes/resourceRoutes.js";

import commentRoutes from "./routes/commentRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import connectDB from "./config/db.js";

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());


app.use("/api/users", userRoutes);

app.use("/api/resources", resourceRoutes);

app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
