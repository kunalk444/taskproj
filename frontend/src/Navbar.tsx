import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'
import type { RootState } from "./reduxfolder/store";

interface User {
  email: string,
  id: string | null,
  name: string,
  isLoggedIn: boolean
}

function Navbar(props: any) {
  const user: User = useSelector((state: RootState) => state.user);
  function handleCreateTask() {
    props.startShow();
  }

  return (
    <nav className="h-16 px-6 flex items-center justify-between bg-slate-900 border-b border-slate-800">
      <Link
        to="/"
        className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition"
      >
        Tasque
      </Link>

      {user.isLoggedIn ? (
        <div className="flex items-center gap-6">
          <h3 className="text-sm text-slate-300">
            Welcome back,{" "}
            <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition">
              {user.name}
            </span>
          </h3>

          <button
            type="button"
            onClick={handleCreateTask}
            className="
              px-4 py-2 rounded-md
              bg-indigo-500 text-white text-sm font-medium
              hover:bg-indigo-400
              transition-colors
            "
          >
            Create Task
          </button>

          <button
            type="button"
            className="
              w-9 h-9 rounded-full
              bg-slate-700
              flex items-center justify-center
              hover:ring-2 hover:ring-indigo-400
              transition
            "
          >
            <div className="w-7 h-7 rounded-full bg-slate-400" />
          </button>

          <button
            type="button"
            onClick={props.showLogoutModal}
            className="
              px-3 py-2 rounded-md
              text-sm font-medium
              text-slate-300
              hover:text-white hover:bg-slate-800
              transition-colors
            "
          >
            Logout
          </button>
        </div>
      ) : (
        <a
          href="https://github.com/kunalk444"
          className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors"
        >
          GitHub
        </a>
      )}
    </nav>
  );
}

export default Navbar;
