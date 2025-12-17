import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar(props:any) {
  function handleCreateTask(){
    props.startShow();
  }
  return (
    <nav className="h-16 px-6 flex items-center justify-between
      bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900
      border-b border-slate-700 shadow-lg">

      <Link
        to="/"
        className="text-xl font-semibold tracking-tight
          bg-gradient-to-r from-blue-400 to-purple-400
          bg-clip-text text-transparent
          hover:from-blue-300 hover:to-purple-300 transition"
      >
        Tasque
      </Link>

      <div className="flex items-center gap-4">
        
        <button
          type="button"
          className="
            px-4 py-2 rounded-lg
            bg-gradient-to-r from-blue-500 to-indigo-500
            text-white text-sm font-medium
            shadow-md
            hover:from-blue-400 hover:to-indigo-400
            active:scale-95
            transition-all duration-150
          "
          onClick={handleCreateTask}
        >
          Create Task
        </button>

        <button
          type="button"
          className="
            w-10 h-10 rounded-full
            bg-slate-700
            flex items-center justify-center
            hover:ring-2 hover:ring-indigo-400
            transition
          "
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-500 to-slate-400 animate-pulse" />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
