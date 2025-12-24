"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handledelete = exports.deleteNotifs = exports.displayNotifs = exports.changeprioritystatus = exports.getinsideTaskInfo = exports.metadatabyme = exports.metataskinfo = exports.saveTask = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const usermodel_1 = require("../models/usermodel");
const notifications_1 = require("../models/notifications");
const saveTask = async (taskInfo) => {
    const user = await usermodel_1.userModel.findOne({ email: taskInfo.assignedToEmail });
    if (user) {
        taskInfo.assignedTo = user._id;
    }
    const task = await taskModel_1.default.create(taskInfo);
    if (taskInfo.assignedTo) {
        const notif = await notifications_1.NotifModel.create({ receiverId: taskInfo.assignedTo, message: `A new task was created:${task.title}` });
    }
    const notif2 = await notifications_1.NotifModel.create({ receiverId: taskInfo.assignedBy, message: `A new task was created:${task.title}` });
    if (task)
        return { success: true, assignedTo: user?._id || null, id: task._id };
    return { success: false };
};
exports.saveTask = saveTask;
const metataskinfo = async (id, email) => {
    const tasks = await taskModel_1.default.find({
        $or: [
            { assignedTo: new mongoose_1.default.Types.ObjectId(id) },
            { assignedToEmail: email }
        ]
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
    if (data && data.assignedBy && data.assignedTo) {
        const notif = await notifications_1.NotifModel.create({
            message: `Changes were made in task-progression of ${data.title}`,
            receiverId: data.assignedBy,
        });
        const notif2 = await notifications_1.NotifModel.create({
            message: `Changes were made in task-progression of ${data.title}`,
            receiverId: data.assignedTo,
        });
        return data;
    }
    return null;
};
exports.changeprioritystatus = changeprioritystatus;
const displayNotifs = async (id) => {
    const notifs = await notifications_1.NotifModel.find({ receiverId: id });
    console.log(notifs);
    return notifs;
};
exports.displayNotifs = displayNotifs;
const deleteNotifs = async (id) => {
    const ifdel = await notifications_1.NotifModel.findByIdAndDelete(id);
    if (ifdel)
        return { success: true };
    return { success: false };
};
exports.deleteNotifs = deleteNotifs;
const handledelete = async (id) => {
    const delTask = await taskModel_1.default.findByIdAndDelete(id);
    if (!delTask)
        return { success: false };
    return { success: true };
};
exports.handledelete = handledelete;
