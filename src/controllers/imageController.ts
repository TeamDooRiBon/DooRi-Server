import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const image = require('../modules/image');
const { validationResult } = require('express-validator');
import { groupService } from "../services";

/**
 *  @route GET /image
 *  @desc GET allImages
 *  @access Public
 */
const getImages = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    try{
        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "전체 이미지 조회 성공",
            data: image
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

/**
 *  @route GET /image/:groupId
 *  @desc GET group images
 *  @access Private
 */
const getTravelImage = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
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
            });
        }
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "여행 이미지 조회 성공",
            data: {
                image: group.image
            }
        });
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
    getImages,
    getTravelImage
}