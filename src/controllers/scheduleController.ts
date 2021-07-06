import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
import { groupService, scheduleService } from "../services";
import mongoose from "mongoose";

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
        const writer = req.body.writer;
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        const data = { groupId : mongoose.Types.ObjectId(groupId), title, startTime, endTime, location, memo, writer };

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
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
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
                const scheduleObject = { "_id" : v._id, "startTime" : v.startTime, "title" : v.title, "memo" : v.memo };
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
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
    }
};  

export default {
    makeSchedule,
    getDailySchedule
} 