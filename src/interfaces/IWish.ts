import mongoose from "mongoose";

export interface ILike {
    user: mongoose.Types.ObjectId;
}

export interface IWishList {
    writer: mongoose.Types.ObjectId;
    tag: string;
    content: string;
    likes: ILike[];
}

export interface IWish {
    post: IWishList[];
}