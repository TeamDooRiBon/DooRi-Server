import mongoose from "mongoose";
import { IBoardInterestList } from "./IBoardInterestList";
import { IBoardPostList } from "./IBoardPostList";

export interface IBoard {
    post: [IBoardPostList];
    interest: [IBoardInterestList];
}

export interface IBoardInputDTO {
    post: IBoardPostList;
    interest: IBoardInterestList;
}