import Board from "../models/Board";
import Group from "../models/Group";
import { IBoardInputDTO } from "../interfaces/IBoard";
import groupService from "./groupService";
import mongoose from "mongoose";

const createBoard = async (data: IBoardInputDTO) => {
    const {
        groupId, writer, tag, content
    } = data;

    try {
        const boards = new Board({
            post: [{
                writer,
                tag,
                content
            }]
        });
        await Group.findByIdAndUpdate(groupId, { $set: { boards: boards._id } });
        await boards.save();
        return boards;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addBoard = async (data: IBoardInputDTO) => {
    const {
        groupId, writer, tag, content
    } = data;
    try {
        const group = await Group.findById(groupId);
        const newBoard = await Board.findByIdAndUpdate(group.boards, {
            $push: {
                post: {
                    writer,
                    tag,
                    content
                }
            }
        }, { new: true });
        return newBoard;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const findBoard = async (boardsId: mongoose.Types.ObjectId, tagData: String) => {
    try {
        const boardList = await Board.aggregate([
            { $lookup: { from: 'users', localField: 'post.writer', foreignField: '_id', as: 'writerName' } },
            { $unwind: '$post' }, {
                $match: { _id: boardsId, "$expr": { "$eq": ["$post.tag", tagData] } }
            },
            {
                $project: {
                    "_id": "$post._id",
                    "name": { $arrayElemAt: ["$writerName.name", 0] },
                    "content": "$post.content"
                }
            }
        ]);
        return boardList;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const editBoard = async (userId: mongoose.Types.ObjectId, groupIdData: String, data: IBoardInputDTO) => {
    const {
        boardId, content, tag
    } = data;
    const groupId = groupIdData;
    try {
        const group = await Group.findById(groupId);
        const boards = await Board.findById(group.boards);
        const editData = {
            "_id": boardId,
            "writer": userId,
            "content": content,
            "tag": tag };
        let editIndex = -1;
        boards.post.map((b, index) => {
            if (String(b._id) === boardId) {
                if (b.writer != userId) {
                    return null;
                }
                editIndex = index;
                boards.post[index] = Object.assign(boards.post[index], editData);
            }
        });
        if (editIndex == -1) {
            return -1;
        }
        await Board.findByIdAndUpdate(group.boards, { $set: {post: boards.post}});
        await boards.save();
        return 1;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteBoard = async (userId: mongoose.Types.ObjectId, groupIdData: String, data: IBoardInputDTO) => {
    const {
        boardId, tag
    } = data;
    const groupId = groupIdData;
    try {
        const group = await Group.findById(groupId);
        if (!group.boards) {
            return null;
        }  //보드가 아직 생성 되지 않았을 경우 null 반환

        const boards = await Board.findById(group.boards);
        let removeIndex = -1;
        boards.post.map((b, index) => {
            if (String(b._id) === boardId) {
                if (b.writer != userId) {
                    return null;
                }
                removeIndex = index;
            }
        });
        if ( removeIndex == -1 ) {
            return -1;
        }
        boards.post.splice(removeIndex, 1);
        await boards.save();
        return 1;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default {
    createBoard,
    addBoard,
    findBoard,
    editBoard,
    deleteBoard
}