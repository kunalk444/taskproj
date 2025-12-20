import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "./reduxfolder/store";
import { saveTasks } from "./reduxfolder/taskSlice";
import { useEffect, useState } from "react";
import { sortingTasks } from "./components/filteringhelper";
import InsideTask from "./components/InsideTask";

function Dashboard() {
  const tasks = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch<AppDispatch>();

  const [viewType, setViewType] = useState<"assignedToMe" | "assignedByMe">(
    "assignedToMe"
  );
  const [sortType, setSortType] = useState<"" | "dueDate" | "priority">("");
  const [insideTaskId, setInsideTaskId] = useState<null | Number>(null);

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
    if (sortType === "dueDate" || sortType === "priority") {
      const newarr = sortingTasks(tasks, sortType);
      if (newarr) dispatch(saveTasks(newarr));
    }
  }, [data, dispatch, sortType]);

  if (isLoading) {
    return <div className="p-8 text-slate-400">Loading tasks…</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load tasks,Try Logging out and Signing in again!</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 border border-slate-800 px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            View
          </span>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as any)}
            className="rounded-md bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="assignedToMe">Assigned to me</option>
            <option value="assignedByMe">Assigned by me</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wide text-slate-400">
            Sort
          </span>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as any)}
            className="rounded-md bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task: any, idx: number) => (
          <div
            key={idx}
            className="group relative rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-lg transition hover:border-indigo-500/50 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white leading-snug">
                {task.title}
              </h3>
              <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                {task.priority}
              </span>
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-400">
              {viewType === "assignedToMe" ? (
                <p>
                  Assigned by{" "}
                  <span className="text-slate-300">
                    {task.assignedBy}
                  </span>
                </p>
              ) : (
                <p>
                  Assigned to{" "}
                  <span className="text-slate-300">
                    {task.assignedTo}
                  </span>
                </p>
              )}

              <p>
                Due{" "}
                <span className="text-slate-300">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>
            </div>

            <button
              onClick={() => setInsideTaskId(task.id)}
              className="mt-5 w-full rounded-md border border-slate-700 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white hover:bg-indigo-500/10"
            >
              View Task
            </button>
          </div>
        ))}
      </div>

      {insideTaskId && (
        <InsideTask
          id={insideTaskId}
          stopShow={() => setInsideTaskId(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
