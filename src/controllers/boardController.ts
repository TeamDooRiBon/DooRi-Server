import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
const tagMatch = require('../modules/tag');
import { boardService, groupService } from "../services";
import mongoose from "mongoose";
import Schedule from "../models/Schedule";

/**
 *  @route POST /board/:groupId/:tag
 *  @desc Post board
 *  @access Private
 */
const makeBoard = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    try {
        const { content } = req.body;
        const writer = req.body.user.id;
        const tag = tagMatch[req.params.tag];
        const groupId = req.params.groupId;
        const group = await groupService.findGroupById(groupId);
        
        const data = { 
            groupId : mongoose.Types.ObjectId(groupId),
            writer,
            tag,
            content
        };

        if (group["boards"] === null) {
            await boardService.createBoard(data);
        }
        else {
            await boardService.addBoard(data);
        }
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "보드 생성 성공"
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
    makeBoard
} 