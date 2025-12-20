import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

function Signup(props: any) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [errorNotif, setErrorNotif] = useState<string | null>(null)
  const navigate = useNavigate()

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
    onSuccess: (data, variables) => {
      if (data.state === "in-process") {
        emailRef.current!.value = "";
        passRef.current!.value = "";
        nameRef.current!.value = "";
        navigate(`/verifyotp?email=${encodeURIComponent(variables.email)}`);
      }
    },
    onError: (error: any) => {
      setErrorNotif(error.message);
    },
  })

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

    if (password && password.length < 8) {
      setErrorNotif("Password must contain atleast 8 characters!")
      emailRef.current!.value = ""
      passRef.current!.value = ""
      return;
    }

    signupMutation.mutate({ email, name, password })
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
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Get started in seconds
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
                Name
              </label>
              <input
                type="text"
                ref={nameRef}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="text"
                ref={emailRef}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                ref={passRef}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={signupMutation.isPending}
              className="w-full mt-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-600/30"
            >
              {signupMutation.isPending ? 'Creating...' : 'Get Started'}
            </button>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-400">Already have an account?</span>{' '}
              <button
                onClick={() => props.openlogin()}
                className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup