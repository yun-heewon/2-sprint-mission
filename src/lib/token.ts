var jwt = require('jsonwebtoken');
var { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = require('./constants.js');

//access, refresh 토큰 생성 
function generateTokens(userId) {
    const accessToken = jwt.sign({ sub: userId },
        JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: userId },
        JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' });
    return { accessToken, refreshToken };
}

//accessToken 확인
function verifyAccessToken(token) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
}

//refreshToken 확인
function verifyRefreshToken(token) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
}

module.exports = {
    generateTokens,
    verifyAccessToken,
    verifyRefreshToken
};
