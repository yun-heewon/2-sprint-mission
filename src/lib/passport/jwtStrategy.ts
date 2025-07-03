const { Strategy: JwtStrategy } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME } = require('../constants.js')

//토큰의 유효성 확인 
//클라이언트의 요청이 올 때마다 req.cookie에서 JWT를 꺼내오고, 비밀키를 사용해서 검증
const accessTokenOptions = {
    jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions = {
    jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

//토큰에서 사용자Id 추출 후 db에서 사용자를 찾음 
async function jwtVerify(payload, done) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.sub },
        });
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}

const accessTokenStrategy = new JwtStrategy(
    accessTokenOptions,
    jwtVerify
);

const refreshTokenStrategy = new JwtStrategy(
    refreshTokenOptions,
    jwtVerify
);

module.exports = {
    accessTokenStrategy,
    refreshTokenStrategy
};