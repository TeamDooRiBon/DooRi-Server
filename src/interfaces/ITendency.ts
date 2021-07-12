import mongoose from "mongoose";

export interface ITendency {
    count: [[Number]];
    tendency: ITendencies[];
}
export interface IMember {
    _id: mongoose.Types.ObjectId;
    name: String;
    profileIamge: String;
}
export interface ITendencies {
    member: IMember;
    title: String;
    tag: [String];
    resultImage: String;
    thumbnail: String;
}

