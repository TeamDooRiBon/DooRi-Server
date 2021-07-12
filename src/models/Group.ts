import mongoose from "mongoose";
import { IGroup } from "../interfaces/IGroup";

const GroupSchema = new mongoose.Schema({
    members: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }],
    schedules: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Schedule"
    },
    boards: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Board"
    },
    wishes: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Wish"
    },
    tendencies: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Tendency"
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true
    },
    host: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    travelName: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

export default mongoose.model<IGroup & mongoose.Document>("Group", GroupSchema); 