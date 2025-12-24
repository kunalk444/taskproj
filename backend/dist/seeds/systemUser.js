"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureSystemUserExists = ensureSystemUserExists;
const mongoose_1 = __importDefault(require("mongoose"));
const usermodel_1 = require("../models/usermodel");
async function ensureSystemUserExists() {
    const systemUserId = new mongoose_1.default.Types.ObjectId("000000000000000000000001");
    const existing = await usermodel_1.userModel.findById(systemUserId);
    if (existing) {
        console.log("System user already exists");
        return;
    }
    await usermodel_1.userModel.create({
        _id: systemUserId,
        name: "System",
        email: "system@yourapp.com",
        password: "SYSTEM_ACCOUNT_DO_NOT_LOGIN"
    });
    console.log("System user created");
}
