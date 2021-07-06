import express, { Request, Response } from "express";
const sc = require('../modules/statusCode');
const image = require('../modules/image');
const { validationResult } = require('express-validator');
const generateCode = require('./inviteController');
import { groupService, mainService, userService } from "../services";

const makeTravel = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    try {
        const { travelName, destination, startDate, endDate, imageIndex } = req.body;
        const user = req.body.user;
        let inviteCode = generateCode();  //첫 무작위 참여 코드 6자리 생성
        let group = await groupService.findGroup(inviteCode);
        while (group.length) {  
            //group이 이미 존재한다면 중복된 참여코드이므로 새로 생성해준다.
            inviteCode = generateCode();
            group = await groupService.findGroup(inviteCode);
        }
        const groupImage = image[imageIndex];  //해당 인덱스의 이미지 주소 로드
        const newGroup = await groupService.createGroup({ 
            host: user._id, inviteCode, travelName, 
            destination, startDate, endDate, 
            image: groupImage
        });  // 새로운 여행 그룹 생성
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "참여 코드 생성 성공",
            data: {
                "inviteCode": inviteCode
            }
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({ status: sc.INTERNAL_SERVER_ERROR, success: false, message: "서버 내부 오류" });
    }
};  

const getTravel = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({ 
            status: sc.BAD_REQUEST, 
            success: false, 
            message: "필요한 값이 없습니다." 
        });
    }
    const user = req.body.user;
    try {
        const foundUser = await userService.findUser({ _id: user._id });
        if (!foundUser) {
            return res.status(404).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "유효하지 않은 사용자"
            })
        };
        const travels = await mainService.findTravelByDate({ _id: user._id });
        const whenTravel = ["nowTravels", "comeTravels", "endTravels"];

        let allTravels = new Map();
        for (let i = 0; i < 3; i++) {
            allTravels.set(whenTravel[i], []);
        }

        travels.nowTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name);
            });
            let nowTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                destination: t.destination,
                members: memberNames
            };
            allTravels.get("nowTravels").push(nowTravelData);
        });
        travels.comeTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name);
            });
            let comeTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                destination: t.destination,
                members: memberNames
            };
            allTravels.get("comeTravels").push(comeTravelData);
        });
        travels.endTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name);
            });
            let endTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                destination: t.destination,
                members: memberNames
            };
            allTravels.get("endTravels").push(endTravelData);
        });

        const data = Array.from(allTravels, ([when, group]) => ({ when, group }));

        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "여행 조회 성공",
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
    makeTravel,
    getTravel
}