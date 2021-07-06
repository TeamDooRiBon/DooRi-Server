import express, { Request, Response } from "express";
import { ResultWithContext } from "express-validator/src/chain";
const sc = require('../modules/statusCode');
const image = require('../modules/image');
const { validationResult } = require('express-validator');
const generateCode = require('./inviteController');
import { groupService, mainService, userService } from "../services";

const makeTravel = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
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
        let group = await groupService.findGroupByInviteCode(inviteCode);
        while (group.length) {
            //group이 이미 존재한다면 중복된 참여코드이므로 새로 생성해준다.
            inviteCode = generateCode();
            group = await groupService.findGroupByInviteCode(inviteCode);
        }
        const groupImage = image[imageIndex];  //해당 인덱스의 이미지 주소 로드
        const newGroup = await groupService.createGroup({
            host: user.id, inviteCode, travelName,
            destination, startDate, endDate,
            image: groupImage
        });  // 새로운 여행 그룹 생성
        newGroup.members.unshift(user.id);  //host 여행 멤버 추가
        newGroup.save();
        const hostUser = await userService.findUserById(user.id);
        hostUser.groups.unshift(newGroup._id);  // host user groups 배열에 여행 추가
        hostUser.save();
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
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    const user = req.body.user;
    try {
        const foundUser = await userService.findUserById(user.id);
        if (!foundUser) {
            return res.status(404).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "유효하지 않은 사용자"
            })
        };

        const travels = await mainService.findTravelByDate({ _id: user.id });
        const whenTravel = ["nowTravels", "comeTravels", "endTravels"];

        let allTravels = new Map();
        for (let i = 0; i < 3; i++) {
            allTravels.set(whenTravel[i], []);
        }

        travels.nowTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name["name"]);
            });
            let nowTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                image: t.image,
                destination: t.destination,
                members: memberNames
            };
            allTravels.get("nowTravels").push(nowTravelData);
        });
        travels.comeTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name["name"]);
            });
            let comeTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                image: t.image,
                destination: t.destination,
                members: memberNames
            };
            allTravels.get("comeTravels").push(comeTravelData);
        });
        travels.endTravels.map((t) => {
            let memberNames = [];
            t.members.map((name) => {
                memberNames.push(name["name"]);
            });
            let endTravelData = {
                _id: t._id,
                startDate: t.startDate,
                endDate: t.endDate,
                travelName: t.travelName,
                image: t.image,
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

const pushMemberToTravel = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    const userId = req.body.user.id;
    const groupId = req.params.groupId;
    try {
        const group = await groupService.findGroupById(groupId);
        const user = await userService.findUserById(userId);
        if (!group || !user) {
            return res.status(sc.NOT_FOUND).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "Not found",
            }); // 잘못된 아이디
        }
        group.members.unshift(userId);  // 여행 그룹에 멤버 추가
        await group.save();
        user.groups.unshift(group._id);
        await user.save();
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "여행 참여 성공"
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

const checkTravel = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).json({
            status: sc.BAD_REQUEST,
            success: false,
            message: "필요한 값이 없습니다."
        });
    }
    try {
        const resultTravel = await groupService.findGroupByInviteCode(req.params.inviteCode);
        if (!resultTravel) {
            return res.status(404).json({
                status: sc.NOT_FOUND,
                success: false,
                message: "잘못된 참여코드입니다."
            })
        };
        const hostObject = await userService.findUserById(String(resultTravel[0].host));
        const travelData = {
            "groupId": resultTravel[0]._id,
            "travelName": resultTravel[0].travelName,
            "host": hostObject.name,
            "destination": resultTravel[0].destination,
            "startDate": resultTravel[0].startDate,
            "endDate": resultTravel[0].endDate,
            "image": resultTravel[0].image
        };
        return res.status(200).json({
            status: sc.OK,
            success: true,
            message: "참여 코드로 여행 찾기 성공",
            data: travelData
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
        getTravel,
        pushMemberToTravel,
        checkTravel
    }