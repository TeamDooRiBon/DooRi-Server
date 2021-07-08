import mongoose from "mongoose";

export interface IBoardPostList {
    writer: mongoose.Types.ObjectId;
    tag: string;
    content: string;
}

export interface IBoard {
    post: IBoardPostList[];
}

export interface IBoardInputDTO {
    post: IBoardPostList;
}