import Group from "../models/Group";
import { IGruopInputDTO } from "../interfaces/IGroup";
import { group } from "console";

const createGroup = async (data : IGruopInputDTO) => {
    const {
        host, inviteCode, travelName, destination,
        startDate, endDate, image
    } = data;
    try {
        const group = await Group.create({
            members: [], schedules: null, boards: null, 
            wishes: null, host, inviteCode, 
            travelName, destination, 
            startDate, endDate, image
        });
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

// 이거 findGroupByInviteCode 로 바꾸면 좋을 것 같긴 합니다 (to 정디 ^__^)
const findGroup = async (code: String) => {
    try {
        const gruop = await Group.find({inviteCode : code});
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

const findGroupById = async (code: String) => {
    try {
        const gruop = await Group.findById(code);
        return gruop;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

export default {
    createGroup,
    findGroup,
    findGroupById
} 