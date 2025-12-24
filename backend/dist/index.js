"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const middleware_1 = require("./middleware");
const socket_1 = require("./services/socket");
const systemUser_1 = require("./seeds/systemUser");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
async function startServer() {
    try {
        await mongoose_1.default.connect((process.env.NODE_ENV === "production") ? MONGO_URL : "mongodb://127.0.0.1:27017/taskproj");
        console.log("MongoDB connected via Mongoose");
        await (0, systemUser_1.ensureSystemUserExists)();
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: process.env.NODE_ENV === "production"
                ? true
                : "http://localhost:5173",
            credentials: true,
        }));
        app.use("/auth", auth_1.default);
        app.use("/tasks", middleware_1.authmiddleware, tasks_1.default);
        app.post("/", (req, res) => {
            const { email, password } = req.body;
            res.json({ email, password, from: "backend" });
        });
        const rootDir = process.cwd();
        if (process.env.NODE_ENV === "production") {
            app.use(express_1.default.static(path_1.default.join(rootDir, "../frontend/dist")));
            app.use((req, res) => {
                if (req.path.startsWith("/assets")) {
                    return res.status(404).end();
                }
                res.sendFile(path_1.default.join(rootDir, "../frontend/dist/index.html"));
            });
        }
        (0, socket_1.initSocket)(server);
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
}
startServer();
