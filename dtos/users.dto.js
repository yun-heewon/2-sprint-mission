const { object, string, size } = require('superstruct');
const isEmail = require('isEmail');

const CreateUser = object({
    firstName: size(string(), 1, 30),
    lastName: size(string(), 1, 30),
    email: isEmail(),
});

module.exports = {
    CreateUser,
};