import { useQuery } from '@tanstack/react-query'
import Dashboard from './Dashboard'
import Signup from './components/Signup'
import Navbar from './Navbar'
import { useState } from 'react'
import Login from './components/Login'
import { useEffect,useRef } from 'react';
import Createtask from './components/Createtask'
import Logout from './components/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { delData, saveData } from './reduxfolder/userSlice'
import type { RootState, AppDispatch } from "./reduxfolder/store";
import { socket } from "./components/socket";
import PreLogin from './components/PreLogin'
import GoogleUserPassword from './components/GoogleUserPassword'
import Notifications from './components/Notifications'

interface User { email: string, id: string | null, name: string, isLoggedIn: boolean }

function Home() {
  const user: User = useSelector((state: RootState) => state.user);
  const socketTimeoutRef = useRef<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [showsignup, setshowsignup] = useState<boolean>(false);
  const [socketNotif, setSocketNotif] = useState<string | null>(null);
  const [showlogin, setshowlogin] = useState<boolean>(false);
  const [showlogout, setshowlogout] = useState<boolean>(false);
  const [closeSignupOpenLogin, setCloseSignupOpenLogin] = useState<boolean>(false);
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [newTaskFlag, setNewTaskFlag] = useState<string | null>(null);
  const [googlePassword,openGooglePassword] = useState<boolean>(false);
  const [notifs,showNotifs] = useState<boolean>(false);

  const { data: user1,isError} = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('/auth/verifyuser', {
        method: 'GET',
        credentials: 'include'
      })
      if (!res.ok){
        dispatch(delData());
        throw new Error("something went wrong!");
      } 
      return res.json()
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled:user.isLoggedIn
  })
  useEffect(() => {
  if (!user.isLoggedIn) {
    setshowlogout(false);
    setshowlogin(false);
    setshowsignup(false);
    setShowCreateTask(false);
  }
  }, [user.isLoggedIn]);

  useEffect(() => {
    if (closeSignupOpenLogin) {
      setshowsignup(false);
      setshowlogin(true);
    }
    if (newTaskFlag) {
      setTimeout(() => {
        setNewTaskFlag(null);
      }, 1300);
    }
  }, [closeSignupOpenLogin, user, newTaskFlag]);

  useEffect(()=>{
    if(user1 && user1.success){
      dispatch(saveData(user1.userObj));
    }
  },[user1]);

  useEffect(()=>{
    if(isError){
      socket.disconnect();
      dispatch(delData());
    }
  },[isError]);

 useEffect(() => {
  if (!user.isLoggedIn || !user.id) return;

  socket.connect();
  socket.emit("join", user.id);

}, [user.isLoggedIn, user.id]);


  useEffect(() => {
    socket.on("task-assigned", (payload) => {
      if (socketTimeoutRef.current) {
        clearTimeout(socketTimeoutRef.current);
      }
      setSocketNotif(`${payload.type} ${payload.taskName}`);
      socketTimeoutRef.current =window.setTimeout(() => setSocketNotif(null), 1500);

    });

    socket.on("task-updated", (payload) => {
      setSocketNotif(`${payload.type}: ${payload.taskName}`);
      setTimeout(() => setSocketNotif(null), 1500);
    });

    return () => {
      socket.off("task-assigned");
      socket.off("task-updated");
    };
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
    <Navbar 
    startShow={() => setShowCreateTask(true)} 
    showLogoutModal={(() => setshowlogout(true))} 
    showNotifs={()=>showNotifs(true)}
    />
    {newTaskFlag && (
      <div
        className="
          fixed top-6 right-6 z-50
          rounded-lg bg-emerald-500/95
          px-5 py-3
          text-sm font-semibold text-white
          shadow-lg
          animate-toast-in
        "
      >
        {newTaskFlag}
      </div>
    )}
    {socketNotif && (
      <div
        className="
      fixed top-20 right-6 z-50
      rounded-lg bg-indigo-500/95
      px-5 py-3
      text-sm font-semibold text-white
      shadow-lg
      animate-toast-in
    "
      >
        {socketNotif}
      </div>
    )}


    {user && user.isLoggedIn ? (
      <Dashboard />
    ) : (
        <PreLogin setshowsignup={()=>setshowsignup(true)}/>
    )}

    {showsignup && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-2xl p-8 border border-slate-700">
          <Signup stopShow={() => setshowsignup(false)} 
                  openlogin={() => setCloseSignupOpenLogin(true)}
                  openGooglePassword = {()=>openGooglePassword(true)}
          />
        </div>
      </div>
    )}
    {showlogin && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-2xl p-8 border border-slate-700">
          <Login stopShow={() => {
            setshowlogin(false);
            setCloseSignupOpenLogin(false);
          }
          } />
        </div>
      </div>
    )}
    {
      googlePassword && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-2xl p-8 border border-slate-700">
          <GoogleUserPassword stopShow={()=>openGooglePassword(false)}/>
          </div>
          </div>
        )
    }

    {showCreateTask && <Createtask stopShow={() => setShowCreateTask(false)} setNewTaskFlag={() => setNewTaskFlag("New Task Created!")} />}
    {showlogout && <Logout show = {showlogout} stopShow={() => setshowlogout(false)} />}
    {notifs && <Notifications show={notifs} stopShow={()=>showNotifs(false)}/>}
  </div>
)
}

export default Home