import { useQuery } from '@tanstack/react-query'
import Dashboard from './Dashboard'
import Signup from './components/Signup'
import Navbar from './Navbar'
import { useState } from 'react'
import Login from './components/Login'
 import { useEffect } from 'react';
import Createtask from './components/Createtask'
import Logout from './components/Logout'
import { useDispatch, useSelector } from 'react-redux'
import { saveData } from './reduxfolder/userSlice'
import type { RootState, AppDispatch } from "./reduxfolder/store";
interface User{email:string,id:string|null,name:string,isLoggedIn:boolean}

function Home() {
  const user:User = useSelector((state:RootState)=>state.user);
  console.log(user);
  const dispatch = useDispatch<AppDispatch>();
  const [showsignup, setshowsignup] = useState<boolean>(false);
  const [showlogin,setshowlogin] = useState<boolean>(false);
  const[showlogout,setshowlogout] = useState<boolean>(false);
  const[closeSignupOpenLogin,setCloseSignupOpenLogin] =useState<boolean>(false);
  const[showCreateTask,setShowCreateTask] = useState<boolean>(false);
  const [newTaskFlag,setNewTaskFlag] = useState<string|null>(null);
  const { data: user1 } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await fetch('http://localhost:5000/auth/verifyuser', {
        method: 'GET',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('not authenticated!')
      return res.json()
    },
    retry: false
  })
 
    useEffect(() => {
        if (closeSignupOpenLogin) {
            setshowsignup(false);
            setshowlogin(true);
        }
        if(user1  && user1.success){
            dispatch(saveData(user1.userObj)); 
            console.log(user1.userObj);
        }
        if(newTaskFlag){
          setTimeout(()=>{
            setNewTaskFlag(null);
          },1300);
        }
    }, [closeSignupOpenLogin,user,newTaskFlag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      <Navbar startShow = {()=>setShowCreateTask(true)} showLogoutModal={(()=>setshowlogout(true))}/>
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

      {user.isLoggedIn ? (
        <Dashboard />
      ) : (
        <div className="flex justify-center px-6 pt-28">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-800/90 backdrop-blur-md 
                          shadow-2xl shadow-black/60 border border-slate-700/50 p-14">
            <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
              Organize work. Focus better.
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed">
              A modern task and team management platform built for speed,
              clarity, and effortless collaboration.
            </p>
            <button
              onClick={() => setshowsignup(true)}
              className="px-12 py-4 rounded-2xl bg-teal-600 text-white text-xl font-semibold
                         hover:bg-teal-500 transition-all duration-300 shadow-xl shadow-teal-600/30"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
      
      {showsignup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-2xl bg-slate-800 shadow-2xl p-8 border border-slate-700">
            <Signup stopShow={() => setshowsignup(false)} openlogin = {()=>setCloseSignupOpenLogin(true)} />
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
            }/>
          </div>
        </div>
      )}

      {showCreateTask && <Createtask stopShow={()=>setShowCreateTask(false)} setNewTaskFlag = {()=>setNewTaskFlag("New Task Created!")}/>}
      {showlogout && <Logout stopShow={()=>setshowlogout(false)}/>}
    </div>
  )
}

export default Home