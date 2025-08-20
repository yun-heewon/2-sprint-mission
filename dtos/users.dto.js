const { object, string, size, partial, define } = require('superstruct');
const isEmail = require('is-email');

var Email = define('Email', isEmail);

const CreateUser = object({
    firstName: size(string(), 1, 30),
    lastName: size(string(), 1, 30),
    email: Email,
});

const PatchUser = partial(CreateUser);

module.exports = {
    CreateUser, PatchUser
};