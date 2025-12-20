import { createSlice} from "@reduxjs/toolkit"




const taskSlice = createSlice({
    name:"tasks",
    initialState:[],
    reducers:{
        saveTasks:(state,action)=>{
            console.log(state);
            return action.payload;
        },
        delTasks:()=>{
            return [];
        }
    }

});

export const{saveTasks,delTasks} = taskSlice.actions;
export default taskSlice.reducer;