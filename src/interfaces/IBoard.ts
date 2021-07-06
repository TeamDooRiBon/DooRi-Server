import mongoose from "mongoose";

export interface IBoardInterestList {
    member: mongoose.Types.ObjectId;
    choice: string;
}

export interface IBoardPostList {
    writer: mongoose.Types.ObjectId;
    tag: string;
    content: string;
}

export interface IBoard {
    post: IBoardPostList[];
    interest: IBoardInterestList[];
}

export interface IBoardInputDTO {
    post: IBoardPostList;
    interest: IBoardInterestList;
}