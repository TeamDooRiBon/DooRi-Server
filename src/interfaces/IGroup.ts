import mongoose from "mongoose";

export interface IGroup {
    members: [mongoose.Types.ObjectId];
    schedules: mongoose.Types.ObjectId;
    boards: mongoose.Types.ObjectId;
    wishes: mongoose.Types.ObjectId;
    tendencies: mongoose.Types.ObjectId;
    inviteCode: String;
    host: mongoose.Types.ObjectId;
    travelName: String;
    destination: String;
    startDate: Date;
    endDate: Date;
    image: String;
} 

export interface IGroupInputDTO {
    host: mongoose.Types.ObjectId;
    inviteCode: String;
    travelName: String;
    destination: String;
    startDate: Date;
    endDate: Date;
    image: String;
}

export interface IGroupEditDTO {
    travelName?: String;
    destination?: String;
    startDate?: Date;
    endDate?: Date;
    imageIndex?: Number;
}