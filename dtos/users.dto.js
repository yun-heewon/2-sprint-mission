const { object, string, size, partial, define, optional } = require('superstruct');
const isEmail = require('is-email');

var Email = define('Email', isEmail);

const CreateUser = object({
    email: Email,
    nickname: size(string(), 1, 15),
    password: string(),
    image: optional(string())
});

const PatchUser = partial(CreateUser);

module.exports = {
    CreateUser, PatchUser
};