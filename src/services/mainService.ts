import { userSearchInput } from "../interfaces/IUser";
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

const findTravelByDate = async (data: userSearchInput) => {
    try {
        const nowTravels = await User.find({userId: data}).populate("group", ["startDate", "endDate", "image", "destination", "members"])
        .populate("user", ["name"])
        .select({groups: {$lte: {'startDate': Date.now}}}).select({groups: {$gte: {'endDate': Date.now}}});
        const comeTravels = await User.find({userId: data}).populate("group", ["startDate", "endDate", "image", "destination", "members"])
        .populate("user", ["name"])
        .select({groups: {$gte: {'startDate': Date.now}}});
        const endTravels = await User.find({userId: data}).populate("group", ["startDate", "endDate", "image", "destination", "members"])
        .populate("user", ["name"])
        .select({groups: {$lte: {'endDate': Date.now}}});

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