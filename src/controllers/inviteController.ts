const { nanoid } = require("nanoid");
const generateCode = () => {
    return nanoid(6);
};

module.exports = generateCode;