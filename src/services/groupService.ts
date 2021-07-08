import Group from "../models/Group";
import { IGroupInputDTO } from "../interfaces/IGroup";

const createGroup = async (data : IGroupInputDTO) => {
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

const findGroupByInviteCode = async (code: String) => {
    try {
        const group = await Group.find({inviteCode : code}); //요기
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

const findGroupById = async (groupId: String) => {
    try {
        const group = await Group.findById(groupId).populate("members", ['name', 'profileImage']);
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

export default {
    createGroup,
    findGroupByInviteCode,
    findGroupById
} 