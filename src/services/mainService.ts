import { userSearchInput } from "../interfaces/IUser";
import User from "../models/User";
import Group from "../models/Group";

const findUser = async (data: userSearchInput) => {
    try {
        const user = await User.findOne({_id: data});
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const findTravelByDate = async (data: userSearchInput) => {
    try {
        const date = new Date();
        const user = await User.findOne({_id: data});
        const groupIds = user.groups;

        const nowTravels = await Group.find({_id : {$in : groupIds}, startDate : {$lte : date}, endDate : {$gte : date}}).sort({startDate : 1});
        const comeTravels = await Group.find({_id : {$in : groupIds}, startDate : {$gte : date}}).sort({startDate : 1});
        const endTravels = await Group.find({_id : {$in : groupIds}, endDate : {$lte : date}}).sort({startDate : 1});

        return {nowTravels, comeTravels, endTravels};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export default {
    findUser,
    findTravelByDate
};