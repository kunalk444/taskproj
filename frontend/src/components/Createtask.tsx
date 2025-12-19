import { useForm } from "react-hook-form";

type Priority = "Low" | "Medium" | "High" | "Urgent";
type Status = "To Do" | "In Progress" | "Review" | "Completed";

interface CreateTaskForm {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  assignedToEmail: string;
}

interface CreateTaskProps {
  stopShow: () => void;
}

function Createtask({ stopShow }: CreateTaskProps) {
  const { register, handleSubmit } = useForm<CreateTaskForm>();

  const onSubmit = async (data: CreateTaskForm) => {
    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    stopShow();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="
          w-full max-w-lg
          rounded-xl
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          border border-slate-700
          shadow-2xl
          p-6
        ">
          
          
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Create Task
            </h2>
            <button
              onClick={stopShow}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>

         
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <input
              {...register("title", { required: true, maxLength: 100 })}
              placeholder="Title"
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              {...register("description", { required: true })}
              placeholder="Description"
              rows={3}
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="datetime-local"
              {...register("dueDate", { required: true })}
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              {...register("priority", { required: true })}
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            <select
              {...register("status", { required: true })}
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Status</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>

            <input
              type="email"
              {...register("assignedToEmail", { required: true })}
              placeholder="Assign to (email)"
              className="w-full rounded-md bg-slate-800 border border-slate-700 text-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="
                w-full mt-2
                rounded-md
                bg-gradient-to-r from-blue-500 to-indigo-500
                text-white font-medium
                py-2
                hover:from-blue-400 hover:to-indigo-400
                transition
              "
            >
              Create Task
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default Createtask;
