import mongoose from "mongoose";

export interface IWishList {
    poster: mongoose.Types.ObjectId;
    tag: string;
    content: string;
}