import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
// import mainRouter from "./routes/index.routes.js"
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config({quiet: true})

const app= express();
const port = process.env.PORT || 1000
connectDB();

 app.use(express.json());
 app.use(cookieParser());
 app.use(cors({credentials: true}));

 app.get('/',(req,res)=> res.send("Api working"));
 app.use('/api/auth',authRouter)
 app.use('/api/user',userRouter)
 app.listen(port, ()=> console.log(`Server started at : ${port}`));