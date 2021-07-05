import express, { NextFunction, Request, Response } from "express";
const sc = require('../modules/statusCode');
import { mainService, userService } from "../services";

const getTravel = async (req: Request, res: Response) => {
    const user = req.body.user;
    try{
        const foundUser = await userService.findUser({ _id: user._id });
        if(!foundUser) {
            return res.status(404).json({
                    status: sc.NOT_FOUND,
                    success: false,
                    message: "유효하지 않은 사용자"
                })
        };
        const travels = await mainService.findTravelByDate({ _id: user._id });
        let travelArray: Object[] = [travels.nowTravels, travels.comeTravels, travels.endTravels];

        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "여행 조회 성공",
            data: travelArray
        })
    } catch (err) {
        console.log(err);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
    }
}

export default {
    getTravel
}