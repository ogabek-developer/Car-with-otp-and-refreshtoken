import { ClientError, globalError } from "shokhijakhon-error-handler"
import JwtConfig from "../lib/jwt.config.js";
import User from "../model/User.js";

export const checkAccessToken = async (req, res , next) => {
    try {
        const token = req.headers.token ;
        if(!token) throw new ClientError('Unauthorized !', 401);
        const parseToken = JwtConfig.verifyAccessToken(token) ;
        const findUser = await User.findById(parseToken.user_id);
        if(!findUser) throw new ClientError('Invalid token !', 401);
        req.admin = parseToken.role == "admin" ;
        req.user = findUser;
        return next() ;

    } catch (error) {
        if(error.name == "TokenExpiredError"){
            return res.status(401).json({
                code : "TOKEN_EXPIRED",
                status : 401
            })
        };
        return globalError(error, res)
    }
}