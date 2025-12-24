"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskModel_1 = __importDefault(require("./taskModel"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
userSchema.post("save", async function () {
    const user = this;
    const demo = await taskModel_1.default.create({
        title: "Demo task",
        description: `Just continue being amazing ${user.name}😊`,
        assignedBy: new mongoose_1.default.Types.ObjectId("000000000000000000000001"),
        assignedTo: user._id,
        status: 'In Progress',
        priority: 'Urgent',
        dueDate: new Date(Date.now() + 86400 * 1000)
    });
});
exports.userModel = mongoose_1.default.model("User", userSchema);
