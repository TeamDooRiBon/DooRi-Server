import mongoose from "mongoose";

export interface IBoardInterestList {
    member: mongoose.Types.ObjectId;
    choice: string;
}