import mongoose from "mongoose";

const notifSchema  = new mongoose.Schema({
    message:{
        type:String,
    },
    receiverId:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
});

notifSchema.index({receiverID:1,createdAt:-1},)

export type Notif = mongoose.InferSchemaType<typeof notifSchema>;
export const NotifModel = mongoose.model<Notif>("notifications",notifSchema);
