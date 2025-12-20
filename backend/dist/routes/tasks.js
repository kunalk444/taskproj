"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_1 = require("../controllers/tasks");
const socket_1 = require("../services/socket");
const taskRouter = (0, express_1.Router)();
taskRouter.post("/createtask", async (req, res) => {
    const io = (0, socket_1.getIO)();
    const obj = req.body;
    const assignedBy = req.user.userObj.id;
    const save = await (0, tasks_1.saveTask)({ ...obj, assignedBy });
    //const assignedByMeTasks = await metataskinfo(id);
    const rec = save.assignedTo;
    if (rec && save) {
        io.to(rec.toString()).emit("task-assigned", {
            taskName: obj.title,
            taskId: save.id,
            type: "you were assigned a new task:"
        });
    }
    if (save)
        return res.status(200).json({ success: true });
    return res.status(401).json({ success: false });
});
taskRouter.get("/metainfo", async (req, res) => {
    const id = req.user.userObj.id;
    const metadata = await (0, tasks_1.metataskinfo)(id);
    return res.status(200).json({ metadata });
});
taskRouter.get("/metainfoassignedbyme", async (req, res) => {
    const id = req.user.userObj.id;
    const metadata = await (0, tasks_1.metadatabyme)(id);
    return res.status(200).json({ metadata });
});
taskRouter.get("/getinsidetask", async (req, res) => {
    const taskId = req.query.id;
    const data = await (0, tasks_1.getinsideTaskInfo)(String(taskId));
    if (data) {
        return res.status(200).json({ "success": true, task: data });
    }
    return res.status(400).json({ "success": false });
});
taskRouter.patch("/changepriorityorstatus", async (req, res) => {
    const io = (0, socket_1.getIO)();
    const { id, priority, status } = req.body;
    const data = await (0, tasks_1.changeprioritystatus)(id, priority, status);
    if (!data)
        return res.status(400).json({ "success": false });
    if (data.assignedTo) {
        io.to(data.assignedTo?.toString()).emit("task-updated", {
            taskId: data._id,
            taskName: data.title,
            type: "Changes were made in priority or status"
        });
    }
    if (data.assignedBy) {
        io.to(data.assignedBy?.toString()).emit("task-updated", {
            taskId: data._id,
            taskName: data.title,
            type: "Changes were made in priority or status"
        });
    }
    return res.status(200).json({ "success": true, task: data });
});
exports.default = taskRouter;
