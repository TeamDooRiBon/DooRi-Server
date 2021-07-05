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

export default {
    makeSchedule
} 