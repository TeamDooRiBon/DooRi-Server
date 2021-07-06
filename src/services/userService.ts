import { IUserInputDTO, userSearchInput } from "../interfaces/IUser";
import User from "../models/User";
const findUserById = async (userId: String) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const findUserByEmail = async (data: userSearchInput) => {
    try {
        const user = await User.findOne({ email: data.email });
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
const createUser = async (data: IUserInputDTO) => {
    const {
        name, email, profileImage
    } = data;
    try {
        const user = new User({
            name, email, profileImage, groups: []
        });
        user.save();
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export default {
    findUserById,
    findUserByEmail,
    createUser
}