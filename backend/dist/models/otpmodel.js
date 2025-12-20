"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: "xyz"
    },
    otp: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true
});
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 5 });
exports.otpModel = mongoose_1.default.model("otp", otpSchema);
