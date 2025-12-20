import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "../reduxfolder/store";
import { useSelector, useDispatch } from "react-redux";
import { saveInsideTasks } from "../reduxfolder/insideTask";
import { useMutation } from "@tanstack/react-query";


type InsideTaskType = {
    title: string;
    description: string;
    dueDate: "" | Date;
    priority: "" | "Low" | "Medium" | "High" | "Urgent";
    status: "" | "To-Do" | "In-Progress" | "Review" | "Completed";
    assignedBy: string;
    _id: string;
}

function InsideTask(props: any) {
    const id = props.id;
    const task = useSelector((state: RootState) => state.insidetask);
    const dispatch = useDispatch<AppDispatch>();
    const [priority, setPriority] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);


    const { data, isLoading, isError } = useQuery<{
        success: boolean;
        task: InsideTaskType;
    }>({
        queryKey: ["inside-task", id],
        queryFn: async () => {
            const res = await fetch(
                `http://localhost:5000/tasks/getinsidetask?id=${id}`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to fetch task");
            return res.json();
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: async (payload: {
            id: string;
            priority: string;
            status: string;
        }) => {
            const res = await fetch(
                "http://localhost:5000/tasks/changepriorityorstatus",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update task");
            }

            return res.json();
        },
        onSuccess(data) {
            dispatch(saveInsideTasks(data.task));
            setPriority(data.task.priority);
            setStatus(data.task.status);
            props.stopShow();
        },
    });


    useEffect(() => {
        if (data?.success) {
            dispatch(saveInsideTasks(data.task));
            setPriority(data.task.priority);
            setStatus(data.task.status);
        }
    }, [data, dispatch]);

    if (isLoading || isError) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-white">
                        {task.title}
                    </h2>
                    <button
                        onClick={() => props.stopShow()}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                    {task.description}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">Assigned by</p>
                        <p className="text-slate-300">{task.assignedBy}</p>
                    </div>

                    <div>
                        <p className="text-slate-500">Due date</p>
                        <p className="text-slate-300">
                            {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="mb-1 text-xs text-slate-400">Status</p>
                        <select
                            value={status || task.status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                        >
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Review</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div>
                        <p className="mb-1 text-xs text-slate-400">Priority</p>
                        <select
                            value={priority || task.priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => props.stopShow()}
                        className="px-4 py-2 rounded-md text-sm text-slate-300 hover:text-white"
                    >
                        Close
                    </button>

                    <button
                        onClick={() =>
                            updateTaskMutation.mutate({
                                id: task._id,
                                priority: priority || task.priority,
                                status: status || task.status,
                            })
                        }
                        className="px-4 py-2 rounded-md bg-indigo-500 text-sm font-medium text-white hover:bg-indigo-400"
                    >
                        Save changes
                    </button>

                </div>
            </div>
        </div>
    );
}

export default InsideTask;
