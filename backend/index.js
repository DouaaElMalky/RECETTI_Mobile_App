import express from "express";
import cors from "cors";
const app=express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth_routes.js";
import userRouter from "./routes/user_routes.js"
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
mongoose.connect(process.env.URL_DB)
  .then((result)=>{
    app.listen(process.env.PORT,()=>console.log("server running"));
  }).catch((err)=>console.log(err)
);