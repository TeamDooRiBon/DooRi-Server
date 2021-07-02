import mongoose from "mongoose";
import { IWishList } from "./IWishList";

export interface IWish {
    post: [IWishList];
}

export interface IWishInputDTO {
    post: IWishList;
}