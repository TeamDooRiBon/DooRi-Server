import mongoose from "mongoose";

export interface IUser {
    name: String;
    email: String;
    profileImage: String;
    groups: [mongoose.Types.ObjectId];
} 

export interface userSearchInput {
    _id?: mongoose.Types.ObjectId;
    email?: String;
}

export interface IUserInputDTO {
    name: String;
    email: String;
    profileImage: String;
    groups?: [mongoose.Types.ObjectId];
}