"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hashing_1 = require("../services/hashing");
const usermodel_1 = require("../models/usermodel");
const jwttoken_1 = require("../services/jwttoken");
const google_auth_library_1 = require("google-auth-library");
const authRouter = (0, express_1.Router)();
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
authRouter.post("/googleuser", async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID
        });
        const data = await ticket.getPayload();
        if (!data)
            return res.status(400).json({ success: false });
        if (!data.name || !data.email)
            return res.status(400).json({ success: false });
        let user = await usermodel_1.userModel.findOne({ email: data.email });
        if (user) {
            const cookieToken = (0, jwttoken_1.createJwtToken)({ email: user.email, id: String(user._id), name: user.name });
            res.cookie("jwt", cookieToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 2
            });
            return res.status(200).json({ success: true, alreadyAUser: true, name: user.name, email: user.email, id: user._id });
        }
        if (data.email_verified)
            return res.status(200).json({ success: true, name: data.name, email: data.email });
        return res.status(401).json({ success: false });
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ success: false });
    }
});
authRouter.post("/googleuserfinal", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        let user = await usermodel_1.userModel.findOne({ email });
        if (user) {
            const cookieToken = (0, jwttoken_1.createJwtToken)({ email, id: String(user._id), name: user.name });
            res.cookie("jwt", cookieToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 2
            });
            return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
        }
        const hashedPassword = await (0, hashing_1.hashPassword)(password);
        user = await usermodel_1.userModel.create({
            email,
            name,
            password: hashedPassword,
        });
        const cookieToken = (0, jwttoken_1.createJwtToken)({ email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });
        return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
    }
    catch (err) {
        return res.status(400).json({ "error": err });
    }
});
authRouter.post("/signup", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const hashedPassword = await (0, hashing_1.hashPassword)(password);
        const already = await usermodel_1.userModel.findOne({ email });
        if (already)
            return res.status(400).json({ success: false, message: "User already exists!" });
        const user = await usermodel_1.userModel.create({
            email,
            name,
            password: hashedPassword,
        });
        if (!user)
            return res.status(400).json({ success: false });
        const cookieToken = (0, jwttoken_1.createJwtToken)({ email: user.email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });
        return res.status(200).json({ success: true, name: user.name, email: user.email, id: user._id });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ "error": err });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        const user = await usermodel_1.userModel.findOne({ email });
        const ifSame = await (0, hashing_1.verifyPassword)(password, String(user?.password));
        if (!ifSame || !user)
            return res.status(400).json({ success: false });
        const cookieToken = (0, jwttoken_1.createJwtToken)({ email, id: String(user._id), name: user.name });
        res.cookie("jwt", cookieToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 2
        });
        return res.status(200).json({ success: true, name: user?.name, id: user._id, email: user.email });
    }
    catch (err) {
        return res.status(500).json({ "error": err });
    }
});
authRouter.post("/logout", (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
    return res.status(200).json({ success: true });
});
authRouter.get("/verifyuser", async (req, res) => {
    const token = req.cookies.jwt;
    if (!token)
        return res.status(400).json({ msg: "No token" });
    const data = (0, jwttoken_1.verifyToken)(String(token));
    if (!data)
        return res.status(400).json({ msg: "Invalid token" });
    if (typeof data.userObj !== "object")
        return res.status(401).json({ msg: "Unauthorized" });
    const user = await usermodel_1.userModel.findById(data.userObj?.id);
    if (!user)
        return res.status(401).json({ msg: "User not found" });
    return res.status(200).json(data);
});
exports.default = authRouter;
