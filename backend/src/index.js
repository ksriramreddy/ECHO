import express from 'express';
import dotenv from 'dotenv';
import messageRoutes from "./routes/message.route.js"
import authRoutes from "./routes/auth.route.js"
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectDB } from './lib/db.js';
import { app , server} from './lib/socket.io.js';
import path from 'path';
import { protectRoute } from './middleware/auth.middleware.js';
import { askGemini } from './lib/gemini.ai.js';


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use(cookieParser());
app.use(cors({ 
    credentials:true,
    origin:"http://localhost:5173"
}));
dotenv.config();    

const __dirname = path.resolve();

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.post('/api/gemini',protectRoute, async (req,res)=>{
    const {prompt,past} = req.body
    if(!prompt){
        return res.status(400).json({message: "Prompt is required"})
    }
    try {
        const resp = await askGemini(prompt,past)
        res.json({resp})
    } catch (error) {
        console.log("Error in gemini route: ", error);
        res.status(500).json({message: error.message})
    }
})

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend","dist", "index.html"));
    } 
)}


const POTR = process.env.PORT || 3000;

server.listen(POTR,()=>{
    console.log(`Server is running on port ${POTR}`);
    connectDB()
});