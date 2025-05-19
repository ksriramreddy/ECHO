import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName , email , password,userName } = req.body
    console.log(req.body);
    
    try {
        if(!fullName || !email || !password , !userName){
            return res.status(400).json({message: "All fields are required"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters long"}) 
        }

        const userEmail = await User.findOne({email})

        if(userEmail){
            return res.status(400).json({message: "Email already exists"})
        }

        const existingUser = await User.findOne({userName})

        if(existingUser){
            return res.status(400).json({message: "Username already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const date = new Date.now
        const newUser = new User({
            userName,
            fullName,
            email,
            password: hashedPassword,
            lastSeen : date
        })

        if (newUser) {
            generateToken(newUser._id,res)
            await newUser.save()

            return res.json({
            _id: newUser._id,
            userName : newUser.userName,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
            blockedUsers: newUser.blockedUsers,
            onlineStatus: newUser.onlineStatus,
            lastSeen: newUser.lastSeen,
            statusMessage: newUser.statusMessage,
            createdAt: newUser.createdAt,
        })
        } else {
            return res.status(400).json({message: "Failed to create user"})
        }
    } catch (error) {
        console.log(`Error creating user: ${error.message}`)
        res.status(500).json({message: "Server error"})
    }
}

export const signin = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }

        const isPassCorrect  = await bcrypt.compare(password, user.password)
        if(!isPassCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id,res)
        return res.json({
            _id: user._id,
            userName : user.userName,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            blockedUsers: user.blockedUsers,
            onlineStatus: user.onlineStatus,
            lastSeen: user.lastSeen,
            statusMessage: user.statusMessage,
            createdAt: user.createdAt,
        })

    } catch (error) {
        console.log(`Error signing in user: ${error.message}`)
        res.status(500).json({message: "Server error"})   
    }
}
export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge : 0})
        return res.json({message: "Logged out"})
    } catch (error) {
        console.log(`Error logging out user: ${error.message}`)
        res.status(500).json({message: "Server error"})
    }
}

export const updateProfile  = async (req, res) => {
    try {
        const {profilePic} = req.body
        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"})
        }
        const userId = req.user._id

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic : uploadResponse.secure_url}, {new: true})

        if(updatedUser){
            console.log("Updated user: ", updatedUser);
            return res.json({
                updatedUser
            })
        } else {
            return res.status(400).json({message: "Failed to update profile"})
        }

    } catch (error) {
        console.log(`Error updating profile: ${error.message}`)
        res.status(500).json({message: "Server error"})
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error checking auth: ${error.message}`)
        res.status(500).json({message: error.message})
    }
}

export const updateLastSeen = async (userId) => {
    console.log("Updating last seen for user: ", userId);
    console.log(userId);
    
    try {
        if(!userId) return;
        User.findByIdAndUpdate(userId, {lastSeen: Date.now()}, {new: true})
        .then((updatedUser) => {
                console.log("User not found: ", updatedUser);
        })
    } catch (error) {
        console.log(`Error updating last seen: ${error.message}`)
    }
}