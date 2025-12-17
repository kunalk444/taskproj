import React, { useRef, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Login() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passRef = useRef<HTMLInputElement | null>(null)
  const [errorNotif, setErrorNotif] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!errorNotif) return
    const t = setTimeout(() => setErrorNotif(null), 1600)
    return () => clearTimeout(t)
  }, [errorNotif])

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error("Login failed");
      return data;
    },
    onSuccess: (data,variables) => {
      if(data.success){
        navigate(`/verifyotp?email=${encodeURIComponent(variables.email)}`);
      }else{
        setErrorNotif("User doesn't Exist or Wrong Details Inserted!");
      }
    },
    onError: (err: any) => {
      setErrorNotif(err.message)
    },
  })

  const handleLogin = (): void => {
    const email = String(emailRef.current?.value);
    const password = String(passRef.current?.value);
    if (!email || !password) {
      setErrorNotif("Fill out all fields!")
      emailRef.current!.value = "";
      passRef.current!.value = "";
      return;
    }

    if (password && password.length < 8) {
      setErrorNotif("Password must contain atleast 8 characters!")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return;
    }

    loginMutation.mutate({ email,password })

  }

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center px-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] opacity-30 blur" />

        <div className="relative rounded-2xl bg-white px-8 py-10 shadow-xl">
          <h1 className="text-3xl font-semibold text-[#0f172a] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue
          </p>

          {errorNotif && (
            <div className="mt-5 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 animate-[fadeIn_0.2s_ease-out]">
              {errorNotif}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div className="group">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@email.com"
                className="mt-2 w-full border-b border-slate-300 bg-transparent pb-2 text-[#0f172a] placeholder-slate-400 focus:border-[#14b8a6] focus:outline-none transition-colors"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Password
              </label>
              <input
                ref={passRef}
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full border-b border-slate-300 bg-transparent pb-2 text-[#0f172a] placeholder-slate-400 focus:border-[#14b8a6] focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleLogin}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-[#14b8a6] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d9488] hover:shadow-lg"
            >
              Continue
              <span className="translate-x-0 transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
