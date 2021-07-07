import jwt from "jsonwebtoken";
import config from "../config";

const getToken = (userId) => {
    const payload = {
        user: {
            id: userId
        },
    };
    const token = jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 360000 }, //배포할 때 0 지우세요.
    );
    return token;
};
module.exports = getToken;