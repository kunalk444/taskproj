"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = void 0;
const jwttoken_1 = require("./services/jwttoken");
const authmiddleware = (req, res, next) => {
    const token = req.cookies?.jwt;
    const ifValid = (0, jwttoken_1.verifyToken)(token);
    if (!ifValid?.success)
        return res.status(401).json({ msg: "some error occured!" });
    req.user = ifValid;
    next();
};
exports.authmiddleware = authmiddleware;
