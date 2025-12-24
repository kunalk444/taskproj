"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TempUserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tempUserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
});
exports.TempUserModel = mongoose_1.default.model("TempUser", tempUserSchema);
