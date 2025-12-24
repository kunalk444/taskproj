import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  name: string;
  email: string;
  id: string | null;
  isLoggedIn:boolean
}

const initialState1:UserState = {
        name:"",
        email:"",
        id:"",
        isLoggedIn:false
    };

const userSlice = createSlice({
    name:"user",
    initialState:initialState1,
    reducers:{
        saveData:(state,action:PayloadAction<UserState>)=>{
            state.name = action.payload.name ;
            state.email = action.payload.email;
            state.id=action.payload.id;
            state.isLoggedIn = true;

        },
        delData:(state)=>{
            state.name="",
            state.email="",
            state.id="",
            state.isLoggedIn = false;

        }
    }

});

export const {saveData,delData} = userSlice.actions;
export default userSlice.reducer;