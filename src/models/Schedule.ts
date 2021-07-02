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
    }
});

const SchedulesSchema = new mongoose.Schema({
    groupId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "Group"
    },
    schedules : [ScheduleSchema]
});

export default mongoose.model<ISchedules & mongoose.Document>("Schedule", SchedulesSchema);