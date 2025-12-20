"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const secret = String(process.env.JWT_SECRET);
const createJwtToken = (user) => {
    try {
        const token = jsonwebtoken_1.default.sign(user, secret);
        return token;
    }
    catch (err) {
        console.log("error:", err);
    }
};
exports.createJwtToken = createJwtToken;
const verifyToken = (token) => {
    try {
        if (token === undefined)
            return { success: false };
        const userObj = jsonwebtoken_1.default.verify(token, secret);
        if (userObj)
            return { success: true, userObj };
        return { succes: false };
    }
    catch (err) {
        console.log("error:", err);
        return null;
    }
};
exports.verifyToken = verifyToken;
