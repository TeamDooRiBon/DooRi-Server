import Schedule from "../models/Schedule";
import Group from "../models/Group";
import { ISchedulesInputDTO} from "../interfaces/ISchedule";


const createSchedule = async (data : ISchedulesInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer } = data;

    try { 
        const schedules = new Schedule({
            schedules : [{ 
                title, 
                startTime, 
                endTime, 
                location, 
                memo, 
                writer }]
        });
        await Group.findByIdAndUpdate(groupId , { $set : { schedules : schedules._id }});
        await schedules.save();
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const addSchedule = async (data : ISchedulesInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer } = data;

    try { 
        const group = await Group.findById(groupId);
        await Schedule.findByIdAndUpdate(group.schedules, { $push : { schedules : { 
            title, 
            startTime, 
            endTime, 
            location, 
            memo, 
            writer 
        }}});
    
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const findSchedulesById = async (id: String) => {
    try {
        const schedule = await Schedule.findById(id);
        return schedule;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const findSchedulesByDate = async (date: Date, id: String) => {
    try {
        const group = await Group.findById(id);
        const scheduleTable = await Schedule.findById(group.schedules);

        const scheduleArray = [];

        scheduleTable.schedules.map((v) => {
            const difference = Math.floor((v.startTime.getTime() - date.getTime()) / 86400000);
            if (!difference) {
                const scheduleObject = {
                    "_id": v._id,
                    "startTime": v.startTime,
                    "title": v.title,
                    "memo": v.memo
                };
                scheduleArray.push(scheduleObject);
            }
        }
        );
        // StartTime의 크기순으로 정렬
        const schedules = scheduleArray.sort(function (a, b) {
            return a.startTime - b.startTime;
        });
        return schedules;
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    createSchedule,
    addSchedule,
    findSchedulesById,
    findSchedulesByDate
}

// mongoose.LeanDocument<ISchedule>[]