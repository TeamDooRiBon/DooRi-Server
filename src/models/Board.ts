import mongoose from "mongoose";
import { IBoard } from "../interfaces/IBoard";

const BoardPostSchema = new mongoose.Schema({
    writer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    tag: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const BoardInterstSchema = new mongoose.Schema({
    member: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    choice: [{
        type: String,
        required: true
    }]
});

const BoardSchema = new mongoose.Schema({
    post: [BoardPostSchema],
    interest: [BoardInterstSchema]
});

export default mongoose.model<IBoard & mongoose.Document>("Board", BoardSchema);
