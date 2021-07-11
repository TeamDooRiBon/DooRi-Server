import express, { Request, Response } from "express";
import { tendencyService, userService } from "../services";
const sc = require('../modules/statusCode');
const results = require('../modules/tendencyResult');
const questions = require('../modules/question');

/**
 *  @route GET /tendency/question
 *  @desc get tendency question
 *  @access Public
 */
const getQuestion = async (req: Request, res: Response) => {
    try {
        res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "성향테스트 질문 조회 성공",
            data: {
                question: questions
            }
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({
            status: sc.INTERNAL_SERVER_ERROR,
            success: false,
            message: "서버 내부 오류"
        });
    }
};
/**
 *  @route POST /tendency/:groupId
 *  @desc add tendency result to group
 *  @access Private
 */
const addResult = async (req: Request, res: Response) => {
    const { score, choice } = req.body;
    try {
        const user = await userService.findUserById(req.body.user.id);
        let maxScore = 0, maxIndex = 0, index = 0;
        score.map((num) => {
            if (maxScore < num) {
                maxScore = num;
                maxIndex = index;
            }
            index++;
        });
        const data = {
            member: user._id,
            title: results[maxIndex].title,
            tag: results[maxIndex].tag,
            resultImage: results[maxIndex].resultImage,
            thumbnail: results[maxIndex].thumbnail
        };
        let newScoreArray = [], questionIndex = 0;
        let currentArray = await tendencyService.getCountArray(req.params.groupId);
        const responseData = {
            member: user.name,
            title: results[maxIndex].title,
            tag: results[maxIndex].tag,
            resultImage: results[maxIndex].resultImage,
            thumbnail: results[maxIndex].thumbnail
        }
        if (!currentArray) {    //현재 성향 테스트 결과가 하나도 없을 때
            newScoreArray = [
                [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], 
                [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
            ];  
            choice.map((num) => {
                const index = +num - 1;
                newScoreArray[questionIndex++][index] += 1;
            });
            await tendencyService.createTendency(newScoreArray, data, req.params.groupId);   //생성
            return res.status(sc.OK).json({
                status: sc.OK,
                success: true,
                message: "성향테스트 결과 저장 성공",
                data: responseData
            });
        }
        questionIndex = 0;
        choice.map((num) => {
            const index = +num - 1;
            currentArray[questionIndex][index] = +currentArray[questionIndex++][index] + 1;  // Number->number
        });
        await tendencyService.addCountResult(currentArray, data, req.params.groupId);
        res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "성향테스트 결과 저장 성공",
            data: responseData
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({
            status: sc.INTERNAL_SERVER_ERROR,
            success: false,
            message: "서버 내부 오류"
        });
    }
};
/**
 *  @route GET /tendency/:groupId
 *  @desc get group tendencies
 *  @access Private
 */
const getAllResult = async (req: Request, res: Response) => {
    try {   
        const myResult = await tendencyService.getMyResult(req.params.groupId, req.body.user.id);
        const othersResult = await tendencyService.getOtherResult(req.params.groupId, req.body.user.id);

        res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "성향테스트 전체 결과 조회 성공",
            data: {
                "myResult": myResult,
                "othersResult": othersResult
            }
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({
            status: sc.INTERNAL_SERVER_ERROR,
            success: false,
            message: "서버 내부 오류"
        });
    }
};

const getAnswerCount = async (req: Request, res: Response) => {
    try {
        let data = [];
        let count = await tendencyService.getCountArray(req.params.groupId);
        if (!count) {
            questions.map((question) => {
                const resultData = {
                    title: question.title,
                    content: {
                        answer: question.content.answer,
                        count: [0, 0, 0, 0]
                    }
                };
                data.push(resultData);
            });
            return res.status(sc.OK).json({
                status: sc.OK,
                success: true,
                message: "성향 카운팅 조회 성공",
                data: data
            });
        }
        let index = 0;
        questions.map((question) => {
            const resultData = {
                title: question.title,
                content: {
                    answer: question.content.answer,
                    count: count[index++]
                }
            }
            data.push(resultData);
        });
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "성향 카운팅 조회 성공",
            data: data
        });
    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).json({
            status: sc.INTERNAL_SERVER_ERROR,
            success: false,
            message: "서버 내부 오류"
        });
    }
};

export default {
    getQuestion,
    addResult,
    getAllResult,
    getAnswerCount
}