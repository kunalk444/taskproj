import { createSlice} from "@reduxjs/toolkit"




const taskSlice = createSlice({
    name:"tasks",
    initialState:[],
    reducers:{
        saveTasks:(state,action)=>{
            return action.payload;
        },
        delTasks:()=>{
            return [];
        }
    }

});

export const{saveTasks,delTasks} = taskSlice.actions;
export default taskSlice.reducer;