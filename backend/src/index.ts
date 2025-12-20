import  express from "express";
import 'dotenv/config';
import cors from "cors";
import authRouter from "./routes/auth";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Request,Response,NextFunction } from "express";
import { authmiddleware } from "./middleware";
import taskRouter from "./routes/tasks";
import http from "http";
import { initSocket } from "./services/socket";


const port = Number(process.env.PORT);
const mongourl = String(process.env.MONGO_URL);

async function dbconnect(url:string) {
    return await mongoose.connect(url);
}

dbconnect(mongourl).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.error(err);
})

const app = express();

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/auth",authRouter);
app.use("/tasks",authmiddleware,taskRouter);
app.post("/",(req,res)=>{
    const {email,password} = req.body;
    return res.json({email,password,from:"backend"})
})
