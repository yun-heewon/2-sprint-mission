import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "./constants";

//access, refresh 토큰 생성 
export function generateTokens(userId: number) {
    const accessToken = jwt.sign({ sub: userId },
        JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: userId },
        JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' });
    return { accessToken, refreshToken };
}

//accessToken 확인
export function verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    return { userId: decoded.sub };
}

//refreshToken 확인
export function verifyRefreshToken(token: string) {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
    return { userId: decoded.sub };
}


