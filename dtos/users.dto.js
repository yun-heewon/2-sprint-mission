const { object, string, size, is } = require('superstruct');
const isEmail = require('isEmail');

const CreateUser = object({
    name: size(string(), 1, 30),
    email: isEmail(),
});

module.exports = {
    CreateUser,
};