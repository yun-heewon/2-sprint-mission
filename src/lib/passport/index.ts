const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { localStrategy } = require('./localStrategy.js');
const { accessTokenStrategy, refreshTokenStrategy } = require('./jwtStrategy.js');

passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);
passport.use('local', localStrategy);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});

module.exports = passport;