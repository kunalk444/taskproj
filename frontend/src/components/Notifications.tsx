import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../reduxfolder/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User { email: string, id: string | null, name: string, isLoggedIn: boolean }


function Notifications(props: any) {
    const { show, stopShow } = props;
    const user: User = useSelector((state: RootState) => state.user);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (notifId: string) => {
            const res = await fetch("/tasks/deletenotifs", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ id: notifId }),
            });

            if (!res.ok) throw new Error("delete failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });


    const { data, isLoading, isError } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await fetch("/tasks/notifications", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ id: user.id })
            });
            if (!res.ok) throw new Error("failed to fetch");
            return res.json();
        },
        enabled: show,
    });

    if (!show) return null;

    return (
        <>
            <div
                onClick={stopShow}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <div className="fixed z-50 top-20 right-6 w-[360px] rounded-lg bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-200">
                        Notifications
                    </h3>
                    <button
                        onClick={stopShow}
                        className="text-slate-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[420px] overflow-y-auto">
                    {isLoading && (
                        <p className="px-4 py-6 text-sm text-slate-400">
                            Loading notifications…
                        </p>
                    )}

                    {isError && (
                        <p className="px-4 py-6 text-sm text-red-400">
                            Failed to load notifications
                        </p>
                    )}

                    {data?.success && data.message?.length === 0 && (
                        <p className="px-4 py-6 text-sm text-slate-400">
                            No new notifications
                        </p>
                    )}

                    {data?.success &&
                        data.arr?.map((notif: any, index: number) => (
                            <div
                                key={index}
                                className="group flex items-start justify-between gap-3 px-4 py-3 border-b border-slate-800 hover:bg-slate-800 transition"
                            >
                                <p className="text-sm text-slate-200 leading-relaxed">
                                    {notif.message}
                                </p>

                                <button
                                    onClick={() => deleteMutation.mutate(notif._id)}
                                    className="
                                        opacity-0 group-hover:opacity-100
                                        text-slate-500 hover:text-red-400
                                        transition
                                     "
                                    title="Dismiss"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}

                </div>
            </div>
        </>
    );
}

export default Notifications;
