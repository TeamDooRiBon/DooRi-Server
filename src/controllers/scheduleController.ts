import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const setTimeFormat = require('../modules/setTimeFormat');
const getCurrentTime = require('../modules/getCurrentTime');
const { validationResult } = require('express-validator');
import { userService, groupService, scheduleService } from "../services";
import mongoose from "mongoose";
import Schedule from "../models/Schedule";

/**
 *  @route POST /schedule/:groupId
 *  @desc Post schedule
 *  @access Private
 */
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
        const start = new Date(startTime);
        const end = new Date(endTime);
        const writer = req.body.user.id;
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
        const createdAt = getCurrentTime();
        const data = { 
            groupId : mongoose.Types.ObjectId(groupId),
            title, 
            startTime: start, 
            endTime: end, 
            location, 
            memo, 
            writer,
            createdAt
        };

        if (group["schedules"] === null) {
            await scheduleService.createSchedule(data);
        }
        else {
            await scheduleService.addSchedule(data);
        }
        
        const date = new Date(startTime);
        const schedules = await scheduleService.findSchedulesByDate(date, groupId);

        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "스케쥴 생성 성공",
            data: schedules
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ 
            status: sc.INTERNAL_SERVER_ERROR, 
            success: false, 
            message: "서버 내부 오류" });
    }
};  

/**
 *  @route GET /schedule/daily/:groupId/:date
 *  @desc Get daily schedule
 *  @access Private
 */
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
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
        const date = new Date(req.params.date);
        const day = Math.ceil((date.getTime() - group.startDate.getTime())/86400000)+1;
        const schedules = await scheduleService.findSchedulesByDate(date, groupId);   // 해당 날짜 스케쥴 찾기
        if(!schedules) {
            return res.status(sc.OK).json({
                status: sc.OK,
                success: true,
                message: "일정 조회 성공",
                data: null
            })
        } //그룹 내 스케줄이 아예 없을 때 null 반환
        const data = { 
            day, 
            date : req.params.date, 
            schedules
        }; 

        
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

/**
 *  @route GET /schedule/:groupId/:scheduleId
 *  @desc Get specific schedule
 *  @access Private
 */
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
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
        if(!group.schedules) {
            return res.status(sc.OK).json({
                status: sc.OK,
                success: true,
                message: "일정 조회 성공",
                data: null
            })
        } // 그룹 내 스케줄이 아예 없을 때 null 반환
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
            "createdAt" : setTimeFormat(schedule.createdAt),
            "tilte" : schedule.title,
            "startTime" : setTimeFormat(schedule.startTime),
            "endTime" : setTimeFormat(schedule.endTime),
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

/**
 *  @route PATCH /schedule/:groupId/:scheduleId
 *  @desc Edit schedule
 *  @access Private
 */
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

        const createdAt = getCurrentTime();
        const start = new Date(startTime);
        const end = new Date(endTime);
        start.setHours(start.getHours() + 9);
        end.setHours(end.getHours() + 9);

        const editedSchedule = { title, startTime: start, endTime: end, location, memo, writer, createdAt };

        const group = await groupService.findGroupById(groupId);
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
        const scheduleTable = await scheduleService.findSchedulesById(String(group.schedules));

        scheduleTable.schedules.map((v, index) => {
            if (String(v._id) === req.params.scheduleId){
                scheduleTable.schedules[index] = Object.assign(scheduleTable.schedules[index], editedSchedule);
            }
        });

        await Schedule.findByIdAndUpdate(group.schedules, {schedules : scheduleTable.schedules});

        const date = new Date(startTime);
        const schedules = await scheduleService.findSchedulesByDate(date, groupId);

        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "일정 수정 성공",
            data: schedules
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
/**
 *  @route DELETE schedule/:groupId/:scheduleId
 *  @desc Delete schedule
 *  @access Private
 */
const deleteSchedule = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
        const scheduleTable = await scheduleService.findSchedulesById(String(group.schedules));  // 스케줄 테이블 찾기
        const deleteSchedule = scheduleTable.schedules.find(
            (schedule) => schedule._id.toString() === req.params.scheduleId
        );  // 삭제할 스케줄 아이디 찾기
        if (!deleteSchedule) {
            return res.status(sc.NOT_FOUND).json({ 
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 일정 id입니다."
            });
        }  // 해당 일정이 없을 때
        const removeIndex = scheduleTable.schedules
            .map((schedule) => schedule._id.toString())
            .indexOf(req.params.scheduleId);

        const date = scheduleTable.schedules[removeIndex].startTime;  // response-body를 위해 해당 날짜 미리 구해 놓는다.
        date.setHours(date.getHours() - 9); // 시차 
        scheduleTable.schedules.splice(removeIndex, 1);  // 스케줄 삭제
        await scheduleTable.save();

        const schedules  = await scheduleService.findSchedulesByDate(date, groupId);
        
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "일정 삭제 완료",
            data: schedules
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
    editSchedule,
    deleteSchedule
} 