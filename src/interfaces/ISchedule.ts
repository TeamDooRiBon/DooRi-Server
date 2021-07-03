import mongoose from "mongoose";

export interface ISchedule {
    title : string;
    startTime : Date;
    endTime : Date;
    location : string;
    memo : string;
}

export interface ISchedules {
    schedules : [ISchedule]
}