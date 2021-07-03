import mongoose from "mongoose";
import { ISchedule, ISchedules } from "../interfaces/ISchedule";

const ScheduleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    startTime : {
        type : Date,
        required : true
    },
    endTime : {
        type : Date,
        required : true
    },
    location : {
        type : String
    },
    memo : {
        type : String
    },
    writer : {
        type: mongoose.Types.ObjectId,
        requried : true
    },
    createdAt : {
        type : Date,
        default : Date.now,
        required : true
    }
});

const SchedulesSchema = new mongoose.Schema({
    schedules : [ScheduleSchema]
});

export default mongoose.model<ISchedules & mongoose.Document>("Schedule", SchedulesSchema);