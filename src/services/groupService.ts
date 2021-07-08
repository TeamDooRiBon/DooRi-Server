import Group from "../models/Group";
import { IGroupEditDTO, IGroupInputDTO } from "../interfaces/IGroup";
import { group } from "console";

const createGroup = async (data: IGroupInputDTO) => {
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
        const group = await Group.find({ inviteCode: code }); //요기
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const findGroupById = async (code: String) => {
    try {
        const group = await Group.findById(code);
        return group;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const editTravel = async (groupId: String, data: IGroupEditDTO) => {
    try {
        const editedTravel = await Group.findByIdAndUpdate(groupId, {
            travelName: data.travelName,
            destination: data.destination,
            startDate: data.startDate,
            endDate: data.endDate,
            image: data.image
        },
        { new: true });
        return editedTravel;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    createGroup,
    findGroupByInviteCode,
    findGroupById,
    editTravel
}