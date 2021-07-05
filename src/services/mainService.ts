import { userSearchInput } from "../interfaces/IUser";
import { findGroupByDateDTO } from "../interfaces/IGroup";
import User from "../models/User";
import Group from "../models/Group";

const findUser = async (data: userSearchInput) => {
    try {
        const user = await User.find({userId: data});
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//const profiles = await User.find().select({result: {$elemMatch: {'name': '변주현' }}});

const findTravelByDate = async (data: userSearchInput, index: Number) => { // 0: 현재 여행, 1: 다가오는 여행, 2: 지나간 여행
    try {
        const travels = await User.find({userId: data}).populate("group", ["startDate", "endDate", "image", "destination", "members"]).select({groups: {$lte: {'startDate': Date.now}}});
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    findUser
};