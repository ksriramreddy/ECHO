import { motion } from "framer-motion";
import { Mail, Calendar, User, MessageSquare, Eye, Lock, Loader } from "lucide-react";
import { useState } from "react";
import defaultProfile from '../../public/profile.png';
import toast from 'react-hot-toast';
import { updateProfile } from "../store/user.store";
import axiosInstance from "../lib/axios";


const Profile = ({ user }) => {
    const [statusMessage, setStatusMessage] = useState(user.statusMessage);
    const [profilePic, setProfilePic] = useState(user.profilePic || defaultProfile);
    const [isLoading, setIsLoading] = useState(false);
    const handleStatusChange = (e) => {
        setStatusMessage(e.target.value);
    };

    const handleProfilePicChange =  (e) => {
        const file = e.target.files[0];
        if(!file) return toast.error('No image selected!');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setProfilePic(reader.result);
            try {
                setIsLoading(true);
                axiosInstance.put('/auth/update-profile', {profilePic : reader.result })
                .then((res) => {
                    // console.log("Updated user from profile page",res.data);
                    localStorage.setItem('user', JSON.stringify(res.data.updatedUser));
                    toast.success('Profile picture updated!');
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Error updating user from profile page", error);
                    toast.error('Failed to update profile picture!');
                })
                
            } catch (error) {
                toast.error('Failed to update profile picture!');
            }
            
        };
    };

    return (
        <motion.div 
            className="bg-white shadow-lg p-8 rounded-lg max-w-3xl w-full mx-auto mt-10 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
                <motion.label 
                    htmlFor="profilePicInput" 
                    className="cursor-pointer shadow-md w-40 h-40 rounded-full border-4 border-blue-500 flex items-center justify-center "
                    whileHover={{ scale: 1.05 }}
                >
                    {
                        isLoading ? <Loader size={20} className="text-blue-500" /> : 
                    
                    <img 
                        src={user.profilePic || defaultProfile} 
                        alt="Profile" 
                        className=" rounded-full w-full h-full object-cover"
                    />}
                </motion.label>
                <input 
                    type="file" 
                    id="profilePicInput" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleProfilePicChange}
                />
                <h2 className="text-2xl font-semibold text-blue-700">{user.fullName}</h2>
                <p className="text-gray-600">@{user.userName}</p>
            </div>

            {/* Profile Details */}
            <div className="mt-6 space-y-4 text-gray-800">
                <div className="flex items-center gap-3 border-b pb-2">
                    <Mail size={20} className="text-blue-500" />
                    <p className="text-lg">{user.email}</p>
                </div>

                <div className="flex items-center gap-3 border-b pb-2">
                    <Calendar size={20} className="text-blue-500" />
                    <p className="text-lg">Member Since: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-3 border-b pb-2">
                    <Eye size={20} className={user.onlineStatus ? "text-green-500" : "text-gray-500"} />
                    <p className="text-lg">Status: {user.onlineStatus ? "Online" : "Offline"}</p>
                </div>

                <div className="flex items-center gap-3 border-b pb-2">
                    <Calendar size={20} className="text-blue-500" />
                    <p className="text-lg">Last Seen: {new Date(user.lastSeen).toLocaleString()}</p>
                </div>

                {/* Editable Status Message */}
                <div className="flex items-center gap-3 border-b pb-2">
                    <MessageSquare size={20} className="text-blue-500" />
                    <input 
                        type="text" 
                        className="bg-transparent text-lg outline-none" 
                        value={statusMessage} 
                        onChange={handleStatusChange} 
                        placeholder="Set your status message..."
                    />
                </div>
            </div>

            {/* Blocked Users */}
            <div className="mt-6 p-4 border border-blue-300 rounded-lg bg-blue-50">
                <h3 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
                    <Lock size={20} /> Blocked Users
                </h3>
                {user.blockedUsers.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                        {user.blockedUsers.map((blockedUser, index) => (
                            <li key={index} className="text-gray-800 bg-white p-2 rounded-md shadow-sm">
                                {blockedUser}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No blocked users</p>
                )}
            </div>
        </motion.div>
    );
};

export default Profile;
