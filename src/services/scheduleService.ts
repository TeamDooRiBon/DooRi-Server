import Schedule from "../models/Schedule";
import Group from "../models/Group";
import { ISchedulesInputDTO } from "../interfaces/ISchedule";
const setTimeFormat = require('../modules/setTimeFormat');

const createSchedule = async (data : ISchedulesInputDTO) => {
    const { groupId, title, startTime, endTime, location, memo, writer, createdAt } = data;
    startTime.setHours(startTime.getHours() + 9);
    endTime.setHours(endTime.getHours() + 9);
    try {  
        const schedules = new Schedule({
            schedules : [{ 
                title, 
                startTime, 
                endTime, 
                location, 
                memo, 
                writer,
                createdAt }]
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
    const { groupId, title, startTime, endTime, location, memo, writer, createdAt } = data;
    startTime.setHours(startTime.getHours() + 9);
    endTime.setHours(endTime.getHours() + 9);
    try { 
        const group = await Group.findById(groupId);
        await Schedule.findByIdAndUpdate(group.schedules, { $push : { schedules : { 
            title, 
            startTime, 
            endTime, 
            location, 
            memo, 
            writer,
            createdAt
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
        const year = date.getFullYear();
        const month = date.getMonth()+1;
        const day = date.getDate();
        
        // 해당 일자 00:00 으로 baseDate설정
        // 시차 9시간 더해주기
        const baseDate = new Date(year.toString()+"-"+month.toString()+"-"+day.toString()+" 09:00:00");
        const group = await Group.findById(id);
        const scheduleTable = await Schedule.findById(group.schedules);
        if(!scheduleTable) {
            return null;
        }  //스케줄이 없을 때 null 반환
        const scheduleArray = [];
        scheduleTable.schedules.map((v) => {
            const difference = Math.floor((v.startTime.getTime() - baseDate.getTime()) / 86400000);
            if (!difference) {
                const scheduleObject = {
                    "_id": v._id,
                    "startTime": v.startTime,
                    "formatTime": setTimeFormat(v.startTime),
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