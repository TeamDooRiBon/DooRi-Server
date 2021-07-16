import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
const tagMatch = require('../modules/tag');
import { boardService, groupService, userService } from "../services";
import mongoose from "mongoose";
import Schedule from "../models/Schedule";
import { group } from "console";
import Group from "../models/Group";
import Board from "../models/Board";

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
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
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
        if (!group) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 그룹 id입니다."
            })   
        }
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

/**
 *  @route PATCH /board/:groupId/:tag/:boardId
 *  @desc edit board
 *  @access Private
 */
const editBoard = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const user = req.body.user;
        const groupId = req.params.groupId;
        const tag = tagMatch[req.params.tag];
        const editData = {
            boardId: req.params.boardId,
            content: req.body.content,
            tag
        };
        const result = await boardService.editBoard(user.id, req.params.groupId, editData);
        if (result === 403) {
            return res.status(sc.FORBIDDEN).json({
                status: sc.FORBIDDEN,
                success: false,
                message: "수정 권한 없음" //유저와 작성자가 다름
            });
        }
        const group = await groupService.findGroupById(groupId);
        const editedBoard = await boardService.findBoard(group.boards, tag);
        if (result === 404) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "해당 글이 존재하지 않습니다.",
                data: editedBoard
            });
        }
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "보드 수정 성공",
            data: editedBoard
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
 *  @route DELETE /board/:groupId/:tag/:boardId
 *  @desc delete board
 *  @access Private
 */
const deleteBoard = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const user = req.body.user;
        const tag = tagMatch[req.params.tag];
        const deleteData = {
            boardId: req.params.boardId,
            tag: tag
        };
        const groupId = req.params.groupId;
        const result = await boardService.deleteBoard(user.id, groupId, deleteData);
        if (result == 403) {
            return res.status(sc.FORBIDDEN).json({
                status: sc.FORBIDDEN,
                success: false,
                message: "삭제 권한이 없습니다."
            });
        }
        const group = await groupService.findGroupById(groupId);
        const deletedBoard = await boardService.findBoard(group.boards, tag);
        if (result == 404) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "해당하는 글이 없습니다.",
                data: deletedBoard
            });
        }
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "보드 삭제 완료",
            data: deletedBoard
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
    getBoard,
    editBoard,
    deleteBoard
}