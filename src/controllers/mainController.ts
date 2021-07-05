import express, { NextFunction, Request, Response } from "express";
import config from "../config";
const sc = require('../modules/statusCode');
import gravatar from 'gravatar';
import { check, validationResult } from "express-validator";
import { mainService } from "../services";

const travel = async (req: Request, res: Response) => {
    const user = req.body.user;
    try{
        const foundUser = await mainService.findUser({ _id: user._id });
        if(!foundUser) {
            return res.status(404).json({
                    status: sc.NOT_FOUND,
                    success: false,
                    message: "유효하지 않은 사용자"
                })
        };
        const nowTravel = await mainService.

        
        // data안에 groupId, startDate, endDate, image, destination, members를 각각 0, 1, 2로 묶어서 json객체로 만들어줌
    } catch (err) {
        console.log(err);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
    }
}

export default {
    travel
}