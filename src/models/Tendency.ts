import mongoose from "mongoose";
import { ITendency } from "../interfaces/ITendency";

const TendencySchema = new mongoose.Schema({
    member: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        requried: true
    },
    title: {
        type: String,
        required: true
    },
    tag: [{
        type: String,
        required: true
    }],
    iOSResultImage: {
        type: String,
        required: true
    },
    aOSResultImage: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    }
});

const TendenciesSchema = new mongoose.Schema({
    count: [[{
        type: Number
    }]],
    tendency: [TendencySchema]
});

export default mongoose.model<ITendency & mongoose.Document>("Tendency", TendenciesSchema);