import mongoose from "mongoose";

export interface IBoardPostList {
    poster: mongoose.Types.ObjectId;
    tag: string;
    content: string;
}