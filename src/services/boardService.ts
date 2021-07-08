import Board from "../models/Board";
import Group from "../models/Group";
import { IBoardInputDTO } from "../interfaces/IBoard";


const createBoard = async (data : IBoardInputDTO) => {
    const {
        groupId, writer, tag, content
    } = data;

    try { 
        const boards = new Board({
            post : [{ 
                writer,
                tag,
                content    
            }]
        });
        await Group.findByIdAndUpdate(groupId , { $set : { boards : boards._id }});
        await boards.save();
        return;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const addBoard = async (data : IBoardInputDTO) => {
    const {
        groupId, writer, tag, content
    } = data;
    try {
        const group = await Group.findById(groupId);
        await Board.findByIdAndUpdate(group.boards, { $push : { post : {
            writer,
            tag,
            content
        }}});
        return;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};


export default {
    createBoard,
    addBoard
} 