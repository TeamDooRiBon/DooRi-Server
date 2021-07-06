import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
import { userService, groupService, scheduleService } from "../services";
import mongoose from "mongoose";
import Schedule from "../models/Schedule";

const makeSchedule = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    try {
        const { title, startTime, endTime, location, memo } = req.body;
        const writer = req.body.user.id;
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        
        const data = { 
            groupId : mongoose.Types.ObjectId(groupId),
            title, 
            startTime, 
            endTime, 
            location, 
            memo, 
            writer 
        };

        if (group["schedules"] === null) {
            await scheduleService.createSchedule(data);
        }
        else {
            await scheduleService.addSchedule(data);
        }
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "스케쥴 생성 성공"
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ 
            status: sc.INTERNAL_SERVER_ERROR, 
            success: false, 
            message: "서버 내부 오류" });
    }
};  

const getDailySchedule = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }

    try {
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        const scheduleTable = await scheduleService.findSchedulesById(String(group.schedules));
        const date = new Date(req.params.date);
        const day = Math.ceil((date.getTime() - group.startDate.getTime())/86400000)+1;

        const scheduleArray = [];

        scheduleTable.schedules.map((v) => {
            const difference = Math.floor((v.startTime.getTime() - date.getTime())/86400000);
            if (!difference) {
                const scheduleObject = { 
                    "_id" : v._id, 
                    "startTime" : v.startTime, 
                    "title" : v.title, 
                    "memo" : v.memo 
                };
                scheduleArray.push(scheduleObject);
            }
            }
        );
        // StartTime의 크기순으로 정렬
        const schedules = scheduleArray.sort(function (a, b) {
            return a.startTime - b.startTime;
        });
        
        const data = { day, date, schedules }; 
        
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "일정 조회 성공",
            data
        });

    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ 
            status: sc.INTERNAL_SERVER_ERROR, 
            success: false, 
            message: "서버 내부 오류" 
        });
    }
};  


const getOneSchedule = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }

    try {
        const group = await groupService.findGroupById(req.params.groupId);
        const scheduleTable = await scheduleService.findSchedulesById(String(group.schedules));
        const schedule = scheduleTable.schedules.filter(function (schedule) {
            return String(schedule._id) === req.params.scheduleId 
        })[0];
        const user = await userService.findUserById(String(schedule.writer));

        const writer = {
            "name" : user.name,
            "profileImage" : user.profileImage
        };
        const data = {
            "_id" : schedule._id,
            "writer" : writer,
            "createdAt" : schedule.createdAt,
            "tilte" : schedule.title,
            "startTime" : schedule.startTime,
            "endTime" : schedule.endTime,
            "location" : schedule.location,
            "memo" : schedule.memo 
        }
        

        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "일정 조회 성공",
            data
        });

    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ 
            status: sc.INTERNAL_SERVER_ERROR, 
            success: false, 
            message: "서버 내부 오류" 
        });

    }
};  

// 일정 수정
const editSchedule = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    try {
        const { title, startTime, endTime, location, memo } = req.body;
        const writer = req.body.user.id;
        const groupId = req.params.groupId;
        const editedSchedule = { title, startTime, endTime, location, memo, writer };
        const group = await groupService.findGroupById(groupId);
        const scheduleTable = await scheduleService.findSchedulesById(String(group.schedules));

        scheduleTable.schedules.map((v, index) => {
            if (String(v._id) === req.params.scheduleId){
                scheduleTable.schedules[index] = Object.assign(scheduleTable.schedules[index], editedSchedule);
            }
        });

        await Schedule.findByIdAndUpdate(group.schedules, {schedules : scheduleTable.schedules});

        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "일정 수정 성공"
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ 
            status: sc.INTERNAL_SERVER_ERROR, 
            success: false, 
            message: "서버 내부 오류" 
        });
    }
};  



export default {
    makeSchedule,
    getDailySchedule,
    getOneSchedule,
    editSchedule
} 