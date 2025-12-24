import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxfolder/store';
import { saveData} from '../reduxfolder/userSlice';
import { saveTempData } from '../reduxfolder/tempUser';



function Signup(props: any) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [errorNotif, setErrorNotif] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();

  const signupMutation = useMutation({
    mutationFn: async (payload: { email: string; name: string; password: string }) => {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      return data
    },
    onSuccess: (data) => {
      if(!data.success){
        setErrorNotif(data?.message||"");
      }
      if (data.success) {
        emailRef.current!.value = "";
        passRef.current!.value = "";
        nameRef.current!.value = "";
        dispatch(saveData({ email: data.email, name: data.name, id: data.id, isLoggedIn: data.success }));
        props.stopShow();
        navigate(`/`);
      }
    },
    onError: (error: any) => {
      setErrorNotif(error.message);
    },
  })

  const googleMutation = useMutation({
    mutationFn: async (token: string | undefined) => {
      if (token === undefined) props.stopShow();
      const res = await fetch("/auth/googleuser", {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Google login failed");
      return data;
    },
    onSuccess: (data) => {
      if (data.success) {
        if (data.alreadyAUser) {
          dispatch(saveData({ name: data.name, email: data.email, id: data.id, isLoggedIn: data.success }));
        } else {
          dispatch(saveTempData({ name: data.name, email: data.email }));
          props.openGooglePassword();
        }
        props.stopShow();
      }
    }
  });

  const handleSignup = (): void => {
    const email = String(emailRef.current?.value);
    const password = String(passRef.current?.value);
    const name = String(nameRef.current?.value);

    if (!email || !password || !name) {
      setErrorNotif("Fill out all fields!")
      emailRef.current!.value = "";
      passRef.current!.value = "";
      nameRef.current!.value = "";
      return;
    }
    const emailRegex:RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(!emailRegex.test(email)){
      setErrorNotif("Invalid Email-id")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return;
    }

    if (password && password.length < 8) {
      setErrorNotif("Password must contain atleast 8 characters!")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return;
    }

    signupMutation.mutate({ email, name, password })
  }

return (
  <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => props.stopShow()}
    />

    <div
      className="relative w-full max-w-xs
                 max-h-[95vh]
                 rounded-2xl bg-slate-900/95
                 shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                 border border-slate-700
                 overflow-hidden flex flex-col"
    >
      <div className="absolute inset-0 rounded-2xl opacity-30 blur-2xl
                      bg-gradient-to-br from-teal-500/40 to-emerald-600/40
                      pointer-events-none" />

      <div className="relative px-6 pt-6 pb-4 shrink-0">
        <button
          onClick={() => props.stopShow()}
          className="absolute top-3 right-3 text-gray-500
                     hover:text-gray-200 transition-colors text-xl"
        >
          ×
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            Create account
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Get started in seconds
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-6 overflow-y-auto">
        {errorNotif && (
          <div className="mb-4 rounded-lg bg-red-950/60
                          border border-red-800
                          px-4 py-3 text-sm text-red-300">
            {errorNotif}
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              ref={nameRef}
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800
                         border border-slate-700 text-white
                         placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-teal-500/40 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              ref={emailRef}
              type="text"
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800
                         border border-slate-700 text-white
                         placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-teal-500/40 focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              ref={passRef}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800
                         border border-slate-700 text-white
                         placeholder-gray-500
                         focus:outline-none focus:ring-2
                         focus:ring-teal-500/40 focus:border-teal-500 transition"
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={signupMutation.isPending}
            className="w-full mt-3 py-3 rounded-xl
                       bg-gradient-to-r from-teal-500 to-emerald-600
                       text-white font-semibold
                       hover:opacity-90 active:scale-[0.98]
                       transition disabled:opacity-60
                       disabled:cursor-not-allowed
                       shadow-lg shadow-emerald-600/25"
          >
            {signupMutation.isPending ? "Creating..." : "Get Started"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 bg-slate-900">
                OR
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res: CredentialResponse) => {
                googleMutation.mutate(res.credential);
              }}
              onError={() => {
                console.error("google login error");
              }}
            />
          </div>

          <div className="text-center pt-4">
            <span className="text-sm text-gray-400">
              Already have an account?
            </span>{" "}
            <button
              onClick={() => props.openlogin()}
              className="text-sm font-medium text-teal-400
                         hover:text-teal-300 transition"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);



}

export default Signup