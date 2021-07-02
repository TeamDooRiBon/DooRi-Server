import mongoose from "mongoose";
import { IWish } from "../interfaces/IWish";

const PostSchema = new mongoose.Schema({
    poster: {
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

const WishSchema = new mongoose.Schema({
    post: [PostSchema]
});

export default mongoose.model<IWish & mongoose.Document>("Wish", WishSchema);
