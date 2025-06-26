var dotenv = require('dotenv');

dotenv.config();

const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';
const ACCESS_TOKEN_COOKIE_NAME = 'access-token'
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token';

module.exports = {
    JWT_REFRESH_TOKEN_SECRET,
    JWT_ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
}