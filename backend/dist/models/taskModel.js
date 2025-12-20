"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// interface Task{
//     title:string,
//     description:string,
//     dueDate:Date,
//     priority:"Low"|"Medium"|"High"|"Urgent",
//     status:"To-Do"|"In-Progress"|"Review"|"Completed",
//     assignedBy : mongoose.Types.ObjectId
// }
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"],
        required: true
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Review", "Completed"],
        default: "To Do"
    },
    assignedBy: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        index: true,
        ref: "User"
    },
    assignedTo: {
        type: mongoose_1.default.Types.ObjectId || String,
        required: false,
        index: true,
        ref: "User"
    },
    assignedToEmail: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
const TaskModel = mongoose_1.default.model("Task", taskSchema);
exports.default = TaskModel;
