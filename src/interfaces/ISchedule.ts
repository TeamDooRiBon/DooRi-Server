import mongoose from "mongoose";

export interface ISchedule {
    title : string;
    startTime : Date;
    endTime : Date;
    location : string;
    memo : string;
    writer : mongoose.Types.ObjectId;
    createdAt : Date;
}

export interface ISchedules {
    schedules : [ISchedule]
}