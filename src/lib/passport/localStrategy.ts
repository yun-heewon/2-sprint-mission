const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},

    async function (
        email,
        password,
        done
    ) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(null, false);
        }

        return done(null, user)
    });

module.exports = {
    localStrategy
}