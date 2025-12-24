"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notifSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
    },
    receiverId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
});
notifSchema.index({ receiverID: 1, createdAt: -1 });
exports.NotifModel = mongoose_1.default.model("notifications", notifSchema);
