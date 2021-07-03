import mongoose from "mongoose";
import { IWish } from "../interfaces/IWish";

const PostSchema = new mongoose.Schema({
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
    },
    likes: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        },
    ],
});

const WishSchema = new mongoose.Schema({
    post: [PostSchema],
});

export default mongoose.model<IWish & mongoose.Document>("Wish", WishSchema);
