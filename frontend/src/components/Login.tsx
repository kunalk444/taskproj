import React, { useRef, useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Login(props: any) {
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
    onSuccess: (data, variables) => {
      if (data.success) {
        navigate(`/verifyotp?email=${encodeURIComponent(variables.email)}`);
      } else {
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

    loginMutation.mutate({ email, password })
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
            aria-label="Close modal"
          >
            ×
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to continue
            </p>
          </div>

          {errorNotif && (
            <div className="mb-6 rounded-lg bg-red-900/40 border border-red-800/50 px-4 py-3 text-sm text-red-300">
              {errorNotif}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <input
                ref={passRef}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full mt-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-600/30"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login