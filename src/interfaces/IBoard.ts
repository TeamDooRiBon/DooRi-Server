import mongoose from "mongoose";

export interface IBoardPostList {
    _id?: mongoose.Types.ObjectId;
    writer: mongoose.Types.ObjectId;
    tag: string;
    content: string;
}

export interface IBoard {
    post: IBoardPostList[];
}

export interface IBoardInputDTO {
    boardId? : String;
    groupId? : mongoose.Types.ObjectId;
    writer? : mongoose.Types.ObjectId;
    tag? : string;
    content? : string;
}