import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId,io } from '../lib/socket.io.js';
export const getUserForSideBar  =  async (req,res)=>{
    try {
        const loggedInUser = req.user._id
        const users = await User.find({_id : {$ne : loggedInUser} }).select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: "Server Error in getUserForSideBar "})
    }
}

export const getMessages = async (req,res) =>{
    const {id : userToChatId} = req.params
    const myId = req.user._id

    const messages = await Message.find({
        $or : [{senderId : myId , receiverId: userToChatId},
               {receiverId : myId, senderId: userToChatId}
            ]
    }).sort({createdAt : 1})
    res.status(200).json(messages)
}

export const sendMessage = async (req,res) =>{
    try {
        const {text , image} = req.body
        const receiverId = req.params.id
        const senderId = req.user._id

        let imageUrl = ''
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            if(!uploadResponse){
                return res.status(400).json({message: "Failed to upload image"})
            }
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()
        res.status(200).json(newMessage)    

        const receiverSocketId = getReceiverSocketId(receiverId) 
        if(receiverSocketId){
            io.to(receiverSocketId).emit('getMessage', newMessage)
        }

    } catch (error) {
        res.status(500).json({message: "Server Error in sendMessage"})
    }
}