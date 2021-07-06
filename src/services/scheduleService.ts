import Schedule from "../models/Schedule";
import Group from "../models/Group";
import { IScheduleInputDTO } from "../interfaces/ISchedule";


const createSchedule = async (data : IScheduleInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer } = data;

    try { 
        const schedules = new Schedule({
            schedules : [{ title, startTime, endTime, location, memo, writer }]
        });
        await Group.findByIdAndUpdate(groupId , { $set : { schedules : schedules._id }});
        await schedules.save();
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


const addSchedule = async (data : IScheduleInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer } = data;

    try { 
        const group = await Group.findById(groupId);
        await Schedule.findByIdAndUpdate(group.schedules, { $push : { schedules : { title, startTime, endTime, location, memo, writer }}});
    
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export default {
    createSchedule,
    addSchedule
}