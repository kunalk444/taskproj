import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TempUserState {
  name: string;
  email: string;
}

const initialState1:TempUserState = {
        name:"",
        email:"",
    };

const tempuserSlice = createSlice({
    name:"tempuser",
    initialState:initialState1,
    reducers:{
        saveTempData:(state,action:PayloadAction<TempUserState>)=>{
            state.name = action.payload.name ;
            state.email = action.payload.email;
        },
        delTempData:(state)=>{
            state.name="",
            state.email="";
        }
    }

});

export const {saveTempData,delTempData} = tempuserSlice.actions;
export default tempuserSlice.reducer;