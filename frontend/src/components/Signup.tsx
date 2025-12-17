import React, { useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Signup() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passRef = useRef<HTMLInputElement | null>(null)
  const [errorNotif, setErrorNotif] = useState<string | null>(null)
  const navigate = useNavigate()
  errorNotif && setTimeout(() => {
    setErrorNotif(null)
  }, 1400)

  const signupMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")
      return data
    },
    onSuccess: (data, variables) => {
      if (data.state === "in-process") {
        emailRef.current!.value = ""
        passRef.current!.value = ""
        navigate(`/verifyotp?email=${encodeURIComponent(variables.email)}`)
      }
    },
    onError: (error: any) => {
      setErrorNotif(error.message)
    },
  })

  const handleSignup = (): void => {
    const email = String(emailRef.current?.value)
    const password = String(passRef.current?.value)

    if (!email || !password) {
      setErrorNotif("Fill out both fields!")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return
    }

    if (password && password.length < 8) {
      setErrorNotif("Password must contain atleast 8 characters!")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return
    }

    signupMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center px-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] opacity-30 blur" />

        <div className="relative rounded-2xl bg-white px-8 py-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-[#0f172a] tracking-tight">
            Create account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Get started in seconds
          </p>

          {errorNotif && (
            <div className="mt-5 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
              {errorNotif}
            </div>
          )}

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </label>
              <input
                type="text"
                ref={emailRef}
                placeholder="your@email.com"
                className="mt-2 w-full border-b border-slate-300 bg-transparent pb-2 text-[#0f172a] placeholder-slate-400 focus:border-[#14b8a6] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Password
              </label>
              <input
                type="password"
                ref={passRef}
                placeholder="••••••••"
                className="mt-2 w-full border-b border-slate-300 bg-transparent pb-2 text-[#0f172a] placeholder-slate-400 focus:border-[#14b8a6] focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={handleSignup}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#14b8a6] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d9488] hover:shadow-lg"
            >
              Get Started
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

export default Signup
