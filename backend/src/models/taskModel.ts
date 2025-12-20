import mongoose from "mongoose";

// interface Task{
//     title:string,
//     description:string,
//     dueDate:Date,
//     priority:"Low"|"Medium"|"High"|"Urgent",
//     status:"To-Do"|"In-Progress"|"Review"|"Completed",
//     assignedBy : mongoose.Types.ObjectId
// }

const taskSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    maxlength: 100
  },
  description:{
    type: String,
    required: true
  },
  dueDate:{
    type: Date,
    required: true
  },
  priority:{
    type: String,
    enum: ["Low", "Medium", "High", "Urgent"],
    required: true
  },
  status:{
    type: String,
    enum: ["To Do", "In Progress", "Review", "Completed"],
    default: "To Do"
  },
  assignedBy:{
    type : mongoose.Types.ObjectId,
    required:true,
    index:true,
    ref:"User"
  },
  assignedTo:{
    type : mongoose.Types.ObjectId||String,
    required:false,
    index:true,
    ref:"User"
  },
  assignedToEmail:{
    type:String,
    required:false
  }
}, {
  timestamps: true
}
);

export type Task = mongoose.InferSchemaType<typeof taskSchema>
const TaskModel = mongoose.model<Task>("Task", taskSchema);
export default TaskModel;

