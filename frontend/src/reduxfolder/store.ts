import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import taskSlice from "./taskSlice";
import insideTaskSlice from "./insideTask";
import {retrieveFromLocal, saveInLocal} from "./refreshhandling";
import tempUserSlice from "./tempUser";

const store = configureStore({
    reducer:{
        user:userSlice,
        tasks:taskSlice,
        insidetask:insideTaskSlice,
        tempuser:tempUserSlice
    },
    preloadedState: retrieveFromLocal()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
    saveInLocal({
        user:store.getState().user,  
        tasks:store.getState().tasks,
        insidetask:store.getState().insidetask,
    });
})

// store.dispatch(action);


export default store;