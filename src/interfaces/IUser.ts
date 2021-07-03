import mongoose from "mongoose";

export interface IUser {
    name: String;
    email: String;
    profileImage: String;
    groups: [mongoose.Types.ObjectId];
} 