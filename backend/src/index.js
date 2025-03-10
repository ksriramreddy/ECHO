import express from 'express';
import dotenv from 'dotenv';
import messageRoutes from "./routes/message.route.js"
import authRoutes from "./routes/auth.route.js"
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';
const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}));
dotenv.config();    

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)


const POTR = process.env.PORT || 3000;

app.listen(POTR,()=>{
    console.log(`Server is running on port ${POTR}`);
    connectDB()
});