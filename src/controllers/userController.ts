import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const { validationResult } = require('express-validator');
import { groupService, userService } from "../services";

/**
 *  @route GET /myPage
 *  @desc GET myPage
 *  @access Private
 */
const getMyPage = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const user = await userService.findUserById(req.body.user.id);
        if (!user) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 유저 id입니다."
            })
        };
        const data = {
            "name": user.name,
            "email": user.email,
            "image": user.profileImage,
            "tavelCount": user.groups.length,
            "tendencyCount": user.groups.length
        };
        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "마이페이지 조회 성공",
            data: data
        })
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({
            status: sc.INTERNAL_SERVER_ERROR,
            success: false,
            message: "서버 내부 오류"
        });
    }
}

export default {
    getMyPage
}