import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux";
import type {AppDispatch } from "../reduxfolder/store";
import { delData} from "../reduxfolder/userSlice";
import { delTasks } from "../reduxfolder/taskSlice";
import { delInsideTasks } from "../reduxfolder/insideTask";

function Logout(props: any) {
  const dispatch = useDispatch<AppDispatch>();
  const logoutMutation = useMutation({
      mutationFn:async()=>{
        const res = await fetch("http://localhost:5000/auth/logout",{
          method:'POST',
          credentials:'include'
        });
        if(!res.ok){
          throw new Error("logout failed!");
        }
        const data = await res.json();
        if(data.success){
            dispatch(delData());
            dispatch(delTasks());
            dispatch(delInsideTasks());
            localStorage.removeItem("persistedData");
            props.stopShow();
        }
      }
  })
  const handleLogout =() => logoutMutation.mutate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={() => props.stopShow()}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-slate-800 shadow-2xl border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl bg-gradient-to-r from-teal-500 to-emerald-600 pointer-events-none" />

        <div className="relative p-8">
          <button
            onClick={() => props.stopShow()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Are you sure you want to log out?
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => props.stopShow()}
              className="flex-1 py-3.5 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-3.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-all shadow-lg shadow-red-600/20"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logout