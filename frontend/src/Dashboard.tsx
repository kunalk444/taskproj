import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "./reduxfolder/store";
import { saveTasks } from "./reduxfolder/taskSlice";
import { useEffect, useState } from "react";

function Dashboard() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [viewType, setViewType] = useState<"assignedToMe" | "assignedByMe">(
    "assignedToMe"
  );
  const [sortType, setSortType] = useState<"" | "dueDate" | "priority">("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["task-meta", viewType],
    queryFn: async () => {
      const endpoint =
        viewType === "assignedToMe"
          ? "http://localhost:5000/tasks/metainfo"
          : "http://localhost:5000/tasks/metainfoassignedbyme";

      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) {
      dispatch(saveTasks(data.metadata));
    }
  }, [data, dispatch ,sortType]);

  if (isLoading) {
    return <div className="p-6 text-slate-400">Loading tasks…</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Failed to load tasks</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">View</span>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as any)}
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="assignedToMe">Tasks assigned to me</option>
            <option value="assignedByMe">Tasks assigned by me</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Sort</span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as any)}
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None</option>
            <option value="dueDate">By due date</option>
            <option value="priority">By priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task: any, idx: number) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-lg"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">
                {task.title}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                {task.priority}
              </span>
            </div>

            <div className="mt-4 text-sm text-slate-400 space-y-1">
              {viewType==="assignedToMe"?
                  <p>
                    Assigned by:{" "}
                    <span className="text-slate-300">
                      {task.assignedBy}
                    </span>
                  </p>:
                  <p>
                    Assigned to:{" "}
                    <span className="text-slate-300">
                      {task.assignedTo}
                    </span>
                  </p>
              }
              <p>
                Due:{" "}
                <span className="text-slate-300">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
