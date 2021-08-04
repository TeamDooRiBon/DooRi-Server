import { userSearchInput } from "../interfaces/IUser";
import User from "../models/User";
import Group from "../models/Group";

const findTravelByDate = async (data: userSearchInput) => {
    try {
        const date = new Date();
        const user = await User.findOne({_id: data});
        const groupIds = user.groups;

        const [nowTravels, comeTravels, endTravels]= await Promise.all([
            Group.find({ _id: { $in: groupIds }, startDate: { $lte: date }, endDate: { $gte: date } }).sort({ startDate: 1 }).populate("members", ["name"]),
            Group.find({ _id: { $in: groupIds }, startDate: { $gte: date } }).sort({ startDate: 1 }).populate("members", ["name"]),
            Group.find({ _id: { $in: groupIds }, endDate: { $lte: date } }).sort({ startDate: 1 }).populate("members", ["name"]),
        ]); // 병렬 처리

        return {nowTravels, comeTravels, endTravels};
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default {
    findTravelByDate
};