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
        { expiresIn: 36000 }, 
    );
    return token;
};
module.exports = getToken;