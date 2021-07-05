import mongoose from "mongoose";

export interface IGroup {
    members: [mongoose.Types.ObjectId];
    schedules: mongoose.Types.ObjectId;
    boards: mongoose.Types.ObjectId;
    wishes: mongoose.Types.ObjectId;
    inviteCode: String;
    host: mongoose.Types.ObjectId;
    travelName: String;
    destination: String;
    startDate: Date;
    endDate: Date;
    image: String;
}

export interface findGroupByDateDTO {
    //_id: mongoose.Types.ObjectId;
    members: [mongoose.Types.ObjectId];
    startDate: Date;
    endDate: Date;
    travelName: String;
    destination: String;
    image: String;
}