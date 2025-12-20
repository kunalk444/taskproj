"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeprioritystatus = exports.getinsideTaskInfo = exports.metadatabyme = exports.metataskinfo = exports.saveTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const usermodel_1 = require("../models/usermodel");
const saveTask = async (taskInfo) => {
    const user = await usermodel_1.userModel.findOne({ email: taskInfo.assignedToEmail });
    if (user) {
        taskInfo.assignedTo = user._id;
    }
    const task = await taskModel_1.default.create(taskInfo);
    if (task)
        return { success: true, assignedTo: user?._id || null, id: task._id };
    return { success: false };
};
exports.saveTask = saveTask;
const metataskinfo = async (id) => {
    const tasks = await taskModel_1.default.find({
        assignedTo: new mongoose_1.default.Types.ObjectId(id)
    }).populate("assignedBy", "name").lean();
    if (!tasks)
        return [];
    const assignedByNames = tasks.map((element) => (element.assignedBy?.name));
    let cnt = 0;
    return tasks.map(element => ({
        id: element._id,
        dueDate: element.dueDate,
        assignedBy: (cnt < assignedByNames.length ? assignedByNames[cnt++] : "unknown"),
        priority: element.priority,
        title: element.title
    }));
};
exports.metataskinfo = metataskinfo;
const metadatabyme = async (id) => {
    const tasks = await taskModel_1.default.find({
        assignedBy: new mongoose_1.default.Types.ObjectId(id)
    }, {
        _id: 1,
        dueDate: 1,
        priority: 1,
        title: 1
    })
        .populate("assignedTo", "name").lean();
    const data = tasks.map(item => ({
        ...item,
        assignedTo: item.assignedTo?.name
    }));
    console.log("after:", data);
    return data;
};
exports.metadatabyme = metadatabyme;
const getinsideTaskInfo = async (taskId) => {
    if (taskId == null)
        return null;
    const task = await taskModel_1.default.findById(taskId);
    if (task)
        return task;
    return null;
};
exports.getinsideTaskInfo = getinsideTaskInfo;
const changeprioritystatus = async (id, priority, status) => {
    if (id == null || priority == null || status == null)
        return null;
    const data = await taskModel_1.default.findByIdAndUpdate(id, {
        priority,
        status,
    }, { new: true, runValidators: true });
    return data;
};
exports.changeprioritystatus = changeprioritystatus;
