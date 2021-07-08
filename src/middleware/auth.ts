import jwt from "jsonwebtoken";
import config from "../config";
const sc = require('../modules/statusCode');

export default (req, res, next) => {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if not token
    if (!token) {
        return res.status(sc.UNAUTHORIZED).json({ 
            status: sc.UNAUTHORIZED,
            success: false,
            message: "No token, authorization denied" 
        });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.jwtSecret);

        req.body.user = decoded.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(sc.UNAUTHORIZED).json({ 
            status: sc.UNAUTHORIZED,
            success: false,
            message: "Token is not valid" 
        });
    }
};