import mongoose from "mongoose";
import { userModel } from "../models/usermodel";


export async function ensureSystemUserExists() {
  const systemUserId = new mongoose.Types.ObjectId(
    "000000000000000000000001"
  );

  const existing = await userModel.findById(systemUserId);

  if (existing) {
    console.log("System user already exists");
    return;
  }

  await userModel.create({
    _id: systemUserId,
    name: "System",
    email: "system@yourapp.com",
    password: "SYSTEM_ACCOUNT_DO_NOT_LOGIN"
  });

  console.log("System user created");
}
