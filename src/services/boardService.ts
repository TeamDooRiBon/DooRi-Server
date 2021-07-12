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
                    "_id": "$_id",
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
        boards.post.map((b, index) => {
            if (String(b._id) === boardId) {
                if (b.writer != userId) {
                    return null;
                }
                boards.post[index] = Object.assign(boards.post[index], editData);
            }
        });
        await Board.findByIdAndUpdate(group.boards, { $set: {post: boards.post}});
        await boards.save();
        
        const editedBoard = await findBoard(group.boards, tag);
        return editedBoard;
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
        const boards = await Board.findById(group.boards);
        let removeIndex = 0;
        boards.post.map((b, index) => {
            if (String(b._id) === boardId) {
                if (b.writer !== userId) {
                    return null;
                }
                removeIndex = index;
            }
        });
        boards.post.splice(removeIndex, 1);  // 스케줄 삭제
        await boards.save();

        const deletedBoard = await findBoard(group.boards, tag);
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