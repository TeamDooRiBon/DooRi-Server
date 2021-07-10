import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
const tagMatch = require('../modules/tag');
import { boardService, groupService, userService } from "../services";
import mongoose from "mongoose";
import Schedule from "../models/Schedule";
import { group } from "console";

/**
 *  @route POST /board/:groupId/:tag
 *  @desc Post board
 *  @access Private
 */
const makeBoard = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
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
            groupId: mongoose.Types.ObjectId(groupId),
            writer,
            tag,
            content
        };
        let newBoard;
        if (group["boards"] === null) {
            newBoard = await boardService.createBoard(data);
        }
        else {
            newBoard = await boardService.addBoard(data);
        }
        const updatedBoard = await boardService.findBoard(newBoard._id, tag);
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "보드 추가 성공",
            data: updatedBoard
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
 *  @route GET /board/:groupId/:tag
 *  @desc Get board By tag
 *  @access Private
 */
const getBoard = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const tag = tagMatch[req.params.tag];
        const group = await groupService.findGroupById(req.params.groupId);
        let data = []
        const boardList = await boardService.findBoard(group.boards, tag);

        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "그룹별 보드 조회 성공",
            data: boardList
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
    makeBoard,
    getBoard
}