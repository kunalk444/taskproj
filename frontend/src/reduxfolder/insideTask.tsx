import { createSlice,type PayloadAction } from "@reduxjs/toolkit"


interface InsideTask{
    title:string,
    description:string,
    dueDate:""|Date,
    priority:""|"Low"|"Medium"|"High"|"Urgent",
    status:""|"To-Do"|"In-Progress"|"Review"|"Completed",
    assignedBy : string,
    _id:string
}

const initialState1:InsideTask = {
    title:"",
    description:"",
    dueDate:"",
    priority:"",
    status:"",
    assignedBy:"",
    _id:""
}

const insideTaskSlice = createSlice({
    name:"insidetask",
    initialState:initialState1,
    reducers:{
        saveInsideTasks:(state,action:PayloadAction<InsideTask>)=>{
            const { title, description, dueDate, priority, status, assignedBy , _id } = action.payload;
            return { title, description, dueDate, priority, status, assignedBy,_id};
        },
        delInsideTasks:()=>{
            return initialState1;
        }
    }

});

export const{saveInsideTasks,delInsideTasks} = insideTaskSlice.actions;
export default insideTaskSlice.reducer;