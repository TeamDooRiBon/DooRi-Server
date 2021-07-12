import mongoose from "mongoose";

export interface ISchedule {
    _id? : mongoose.Types.ObjectId;
    title : string;
    startTime : Date;
    endTime : Date;
    location : string;
    memo : string;
    writer : mongoose.Types.ObjectId;
    createdAt : Date;
}

export interface ISchedules {
    schedules : ISchedule[]
}

export interface ISchedulesInputDTO {
    groupId? : mongoose.Types.ObjectId;
    title? : string;
    startTime? : Date;
    endTime? : Date;
    location? : string;
    memo? : string;
    writer? : mongoose.Types.ObjectId;
    createdAt? : Date;
}
