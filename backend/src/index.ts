import  express from "express";
import 'dotenv/config';
import cors from "cors";
import authRouter from "./routes/auth";
import mongoose from "mongoose";

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
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/auth",authRouter);

app.post("/",(req,res)=>{
    const {email,password} = req.body;
    return res.json({email,password,from:"backend"})
})
app.listen(port,()=>{
    console.log(`server running on port:${port}`);
})