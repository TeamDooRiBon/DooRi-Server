import express, { NextFunction, Request, Response } from "express";
import config from "../config";
const sc = require('../modules/statusCode');
import { check, validationResult } from "express-validator";
import { mainService } from "../services";

const getTravel = async (req: Request, res: Response) => {
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
        const travels = await mainService.findTravelByDate({ _id: user._id });
        //let travelArray: Object[] = [travels.nowTravels, travels.comeTravels, travels.endTravels];
        const whenTravel = ["nowTravels", "comeTravels", "endTravels"];

        let allTravels = new Map();
        for (let i = 0; i < 3; i++) {
            allTravels.set(whenTravel[i], []);
        }

        for(let i = 0; i < travels.nowTravels.length; i++) {
            let memberNames = []
            for(let k = 0; k < travels.nowTravels[i].members.length; k++) {
                memberNames.push(travels.nowTravels[i].members[k]);
            }
            let nowTravelData = {
                _id: travels.nowTravels[i]._id,
                startDate: travels.nowTravels[i].startDate,
                endDate: travels.nowTravels[i].endDate,
                travelName: travels.nowTravels[i].travelName,
                destination: travels.nowTravels[i].destination,
                members: memberNames
            };
            allTravels.get("nowTravels").push(nowTravelData);
        }

        for(let i = 0; i < travels.comeTravels.length; i++) {
            let memberNames = []
            for(let k = 0; k < travels.comeTravels[i].members.length; k++) {
                memberNames.push(travels.comeTravels[i].members[k]);
            }
            let comeTravelData = {
                _id: travels.comeTravels[i]._id,
                startDate: travels.comeTravels[i].startDate,
                endDate: travels.comeTravels[i].endDate,
                travelName: travels.comeTravels[i].travelName,
                destination: travels.comeTravels[i].destination,
                members: memberNames
            };
            allTravels.get("comeTravels").push(comeTravelData);
        }
        
        for(let i = 0; i < travels.endTravels.length; i++) {
            let memberNames = []
            for(let k = 0; k < travels.endTravels[i].members.length; k++) {
                memberNames.push(travels.endTravels[i].members[k]);
            }
            let endTravelData = {
                _id: travels.endTravels[i]._id,
                startDate: travels.endTravels[i].startDate,
                endDate: travels.endTravels[i].endDate,
                travelName: travels.endTravels[i].travelName,
                destination: travels.endTravels[i].destination,
                members: memberNames
            };
            allTravels.get("endTravels").push(endTravelData);
        }

        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "여행 조회 성공",
            data: 
        })
    } catch (err) {
        console.log(err);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
    }
}

export default {
    getTravel
}