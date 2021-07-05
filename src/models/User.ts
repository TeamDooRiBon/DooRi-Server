import mongoose from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImage: {
        type: String,
        required: true
    },
    groups: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Group"
    }],
});

export default mongoose.model<IUser & mongoose.Document>("User", UserSchema); 