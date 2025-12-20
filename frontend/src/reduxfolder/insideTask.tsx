import { createSlice,type PayloadAction } from "@reduxjs/toolkit"


interface InsideTask{
    title:string,
    description:string,
    dueDate:""|Date,
    priority:""|"Low"|"Medium"|"High"|"Urgent",
    status:""|"To-Do"|"In-Progress"|"Review"|"Completed",
    assignedBy : string
}

const initialState1:InsideTask = {
    title:"",
    description:"",
    dueDate:"",
    priority:"",
    status:"",
    assignedBy:""
}

const insideTaskSlice = createSlice({
    name:"insidetask",
    initialState:initialState1,
    reducers:{
        saveInsideTasks:(state,action:PayloadAction<InsideTask>)=>{
            return action.payload;
        },
        delInsideTasks:()=>{
            return initialState1;
        }
    }

});

export const{saveInsideTasks,delInsideTasks} = insideTaskSlice.actions;
export default insideTaskSlice.reducer;