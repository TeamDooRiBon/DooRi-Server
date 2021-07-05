import Schedule from "../models/Schedule";
import Group from "../models/Group";
import { IScheduleInputDTO } from "../interfaces/ISchedule";


const findGroup = async (data : IScheduleInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer } = data;

    try { 
        const schedules = new Schedule({
            schedules : [{ title, startTime, endTime, location, memo, writer }]
        });
        await Group.findByIdAndUpdate(groupId , { $set : { schedules : schedules._id }});

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