import { ITendencies } from "../interfaces/ITendency";
import Group from "../models/Group";
import Tendency from "../models/Tendency"

const getCountArray = async (groupId: String) => {
    const group = await Group.findById(groupId);
    if (!group.tendencies) {
        return null;
    }
    const tendencyTabel = await Tendency.findById(group.tendencies);
    return tendencyTabel.count;
};

const createTendency = async (choice: any, data: ITendencies, groupId: String) => {
    const group = await Group.findById(groupId);
    const newTendency = new Tendency({
        count: [],
        tendency: []
    });
    newTendency.count = choice;
    newTendency.tendency.unshift({
        member: data.member,
        title: data.title,
        tag: data.tag,
        iOSResultImage: data.iOSResultImage,
        aOSResultImage: data.aOSResultImage,
        thumbnail: data.thumbnail
    });
    await Group.findByIdAndUpdate(groupId, { $set: { tendencies: newTendency._id } });
    newTendency.save();
    return;    
};

const addCountResult = async (choice: any, data: ITendencies, groupId: String) => {
    try {
        const group = await Group.findById(groupId);
        const tendencyTable = await Tendency.findById(group.tendencies);
        tendencyTable.tendency.unshift({
            member: data.member,
            title: data.title,
            tag: data.tag,
            iOSResultImage: data.iOSResultImage,
            aOSResultImage: data.aOSResultImage,
            thumbnail: data.thumbnail
        });
        await Tendency.findByIdAndUpdate(group.tendencies, { count: choice });
        tendencyTable.save();
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getMyResult = async (groupId: String, userId: String) => {
    try {
        const group = await Group.findById(groupId);
        if (!group.tendencies) {
            return null;
        }
        const tendencies = await Tendency.findById(group.tendencies).populate('tendency.member', ['name', 'profileImage']);
        const myResult = tendencies.tendency.find(
            (tendency) => tendency.member._id.toString() === userId
        );
        if (!myResult) {  // 자신의 성향 테스트 결과가 없을 경우
            return null; 
        }  
        return myResult;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getOtherResult = async (groupId: String, userId: string) => {
    try {
        const group = await Group.findById(groupId);
        if (!group.tendencies) {
            return null;
        }
        const tendencies = await Tendency.findById(group.tendencies).populate('tendency.member', ['name', 'profileImage']);
        const removeIndex = tendencies.tendency
            .map((tendency) => tendency.member._id.toString())
            .indexOf(userId);
        if (removeIndex == -1) {  // 자신의 성향 테스트 결과가 없을 경우
            return tendencies.tendency;  //모든 결과 반환한다.
        }
        tendencies.tendency.splice(removeIndex, 1);  // 자신 제외
        return tendencies.tendency;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default {
    getCountArray,
    createTendency,
    addCountResult,
    getMyResult,
    getOtherResult,
}