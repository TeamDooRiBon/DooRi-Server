import Group from "../models/Group";
import { IGruopInputDTO } from "../interfaces/IGroup";
import { group } from "console";

const createGroup = async (data : IGruopInputDTO) => {
    const { 
        host, inviteCode, travelName, destination, 
        startDate, endDate, image 
    } = data;
    const group = await Group.create({
        members: [], schedules: null, boards: null, 
        wishes: null, host, inviteCode, 
        travelName, destination, 
        startDate, endDate, image
    });
    return group;
};

const findGroup = async (code: String) => {
    try {
        const gruop = await Group.find({inviteCode : code});
        return group;
    } catch (err) {
        console.log(err);
        throw err;
    } 
};

export default {
    createGroup,
    findGroup
}