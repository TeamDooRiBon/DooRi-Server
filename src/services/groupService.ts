import Group from "../models/Group";
import { IGruopInputDTO } from "../interfaces/IGroup";
import { group } from "console";

const createGroup = async (data : IGruopInputDTO) => {
    const {
        host, inviteCode, travelName, destination,
        startDate, endDate, image
    } = data;
    try {
        const group = new Group({
            members: [], schedules: null, boards: null, 
            wishes: null, host, inviteCode, 
            travelName, destination, 
            startDate, endDate, image
        });
        group.save();
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

const findGroup = async (code: String) => {
    try {
        const gruop = await Group.find({inviteCode : code});
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};

export default {
    createGroup,
    findGroup
}