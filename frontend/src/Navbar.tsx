import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./reduxfolder/store";
import { useState } from "react";

interface User {
  email: string;
  id: string | null;
  name: string;
  isLoggedIn: boolean;
}

function Navbar(props: any) {
  const user: User = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);

  function BellIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z"
      />
    </svg>
  );
}

  return (
    <nav className="h-16 px-6 flex items-center justify-between bg-slate-900 border-b border-slate-800">
      <Link
        to="/"
        className="text-lg font-semibold tracking-tight text-indigo-400"
      >
        Tasque
      </Link>

      {user.isLoggedIn ? (
        <div className="flex items-center gap-4 relative">
          <button
            onClick={props.showNotifs}
            className="relative p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <BellIcon />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={props.startShow}
            className="px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition"
          >
            Create Task
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center hover:ring-2 hover:ring-indigo-400 transition"
          >
            <span className="text-sm font-semibold text-slate-200">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-44 rounded-md bg-slate-800 border border-slate-700 shadow-lg overflow-hidden">
              <div className="px-4 py-2 text-sm text-slate-300 border-b border-slate-700">
                {user.name}
              </div>
              
              <button
                onClick={props.showLogoutModal}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <a
          href="https://github.com/kunalk444"
          className="text-sm text-slate-400 hover:text-indigo-400"
        >
          GitHub
        </a>
      )}
    </nav>
  );
}

export default Navbar;
