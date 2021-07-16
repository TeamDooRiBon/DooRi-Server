import express, { Request, Response } from "express";
const axios = require('axios');
const sc = require('../modules/statusCode');
const getToken = require('../modules/jwtToken');
import config from "../config";
import userService from "../services/userService";
const qs = require('qs');

/**
 *  @route POST /auth/user
 *  @desc Authenticate user & get token(로그인)
 *  @access Private
 */
const getKakaoUser = async (req: Request, res: Response) => {
    let access_token = req.body.access_token;
    const refresh_token = req.body.refresh_token;

    try {
        const newToken = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'refresh_token',//특정 스트링
                client_id: config.CLIENT_ID,
                refresh_token: refresh_token,
            })//객체를 string 으로 변환
        }); 

        if (newToken.status != 200) {   
            return res.status(sc.UNAUTHORIZED).json({ 
                status: sc.UNAUTHORIZED, 
                success: false, 
                message: "유효하지 않은 토큰"   
            });  // refresh token으로도 갱신되지 않는 경우 401 반환
        }
        access_token = newToken.data.access_token;
        const user = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });  // user 정보 받아오기
        const checkUser = await userService.findUserByEmail({ email: user.data.kakao_account.email });
        const data = {
            name: user.data.kakao_account.profile.nickname,
            email: user.data.kakao_account.email,
            profileImage: user.data.kakao_account.profile.profile_image_url
        }
        if (!checkUser) {
            //DB에 없는 유저는 새로 생성한 후 토큰 발급한다.
            const newUser = await userService.createUser(data);
            const jwtToken = getToken(newUser._id);
            return res.status(sc.OK).json({
                status: sc.OK,
                success: true,
                message: "유저 생성 성공",
                data: {
                    user: newUser,
                    token: jwtToken,
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            });
        }
        //DB에 이미 존재하는 유저는 토큰 발급 후 전달한다.
        const jwtToken = getToken(checkUser._id);
        return res.status(sc.OK).json({
            status: sc.OK,
            success: true,
            message: "유저 로그인 성공",
            data: {
                user: checkUser,
                token: jwtToken,
                access_token: access_token,
                refresh_token: refresh_token
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

export default {
    getKakaoUser
}