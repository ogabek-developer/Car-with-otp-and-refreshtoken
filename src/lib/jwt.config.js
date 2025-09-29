

import jwt from "jsonwebtoken" ;

const JwtConfig = {
    createAccessToken : (payload) => jwt.sign(payload, process.env.MY_TOKEN_KEY, {expiresIn : "5s"}) ,
    verifyAccessToken : (token) => jwt.verify(token, process.env.MY_TOKEN_KEY),
    createRefreshToken : (payload) => jwt.sign(payload, process.env.MY_REFRESH_TOKEN_KEY, {expiresIn : "30d"}),
    verifyRefreshToken : (refreshToken) => jwt.verify(refreshToken, process.env.MY_REFRESH_TOKEN_KEY)
};

export default JwtConfig;
