
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../reduxfolder/store";
import { useMutation } from "@tanstack/react-query";
import { saveData } from "../reduxfolder/userSlice";
import { useNavigate } from "react-router-dom";
import { delTempData } from "../reduxfolder/tempUser";

function GoogleUserPassword(props: any) {
    const passwordRef = useRef<HTMLInputElement|null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement|null>(null);
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const [showConfirm,setShowConfirm] = useState<boolean>(false);

    const [errorNotif, setErrorNotif] = useState<string | null>(null);
    const tempuser = useSelector((state: RootState) => state.tempuser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const userMutation = useMutation({
        mutationFn: async (payload: { email: string; name: string; password: string }) => {
            const res = await fetch("/auth/googleuserfinal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            })

            const data = await res.json()
            if (!res.ok) throw new Error("Google Signup failed")
            return data
        },
        onSuccess: (data) => {
            if (data.success) { 
                if(passwordRef && passwordRef.current)passwordRef.current.value="";
                if(confirmPasswordRef && confirmPasswordRef.current)confirmPasswordRef.current.value="";
                dispatch(saveData({ email: data.email, name: data.name, id: data.id, isLoggedIn: data.success }));
                dispatch(delTempData());
                props.stopShow();
                navigate(`/`);
            }
        },
        onError: (error: any) => {
            setErrorNotif(error.message);
        },
    });


    const handleSavePassword = () => {
        if(passwordRef && confirmPasswordRef && passwordRef.current && confirmPasswordRef.current){
            const password = passwordRef.current.value;
            const confirmPassword = confirmPasswordRef.current.value;
            if (password.length < 8 || confirmPassword.length < 8) {
                setErrorNotif("Password must be at least 8 characters long.");
                return;
            }

            if (password !== confirmPassword) {
                setErrorNotif("Passwords do not match.");
                return;
            }

            setErrorNotif(null);

            userMutation.mutate({ email: tempuser.email, name: tempuser.name, password: password });
        }
    }
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
                    >
                        ×
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Set a password</h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Just one more step,{tempuser.name}😊.
                            Before Kickstarting your journey.
                        </p>
                    </div>

                    {errorNotif && (
                        <div className="mb-6 rounded-lg bg-red-900/40 border border-red-800/50 px-4 py-3 text-sm text-red-300 animate-pulse">
                            {errorNotif}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-700/60 border border-slate-600 text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                                    ref={passwordRef}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-700/60 border border-slate-600 text-white focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                                    ref={confirmPasswordRef}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(prev => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 text-sm"
                                >
                                    {showConfirm ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSavePassword}
                            className="w-full mt-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-all"
                        >
                            Save password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GoogleUserPassword