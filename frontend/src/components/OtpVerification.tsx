import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

function OTPVerification() {
  const otpRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(90); 
  const [isExpired, setIsExpired] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email: string | null = searchParams.get("email");

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

    const verifyOtpMutation = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
        console.log(payload);
        const res = await fetch("http://localhost:5000/auth/verifyotp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
        }

        return data;
    },
    onSuccess: () => {
        navigate("/login", { replace: true });
    },
    onError: (err: any) => {
        setError(err.message);
    },
    });


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = () => {
    const otp = otpRef.current?.value.trim();

    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }
    verifyOtpMutation.mutate({
        email:email!,
        otp
    });
    otpRef.current!.value = "";
  };

  const handleResendOtp = () => navigate("/signup");

  return (
    <div className="min-h-screen bg-[#1e293b] flex items-center justify-center px-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] opacity-30 blur" />

        <div className="relative rounded-2xl bg-white px-8 py-10 shadow-xl">
          <h2 className="text-3xl font-semibold text-[#0f172a] tracking-tight">
            Verify OTP
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Code sent to{" "}
            <span className="font-medium text-[#0f172a]">
              {email && email.charAt(0) + "...@" + email.split("@")[1]}
            </span>
          </p>

          {!isExpired ? (
            <>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Expires in
                </span>
                <span className="font-mono text-lg font-semibold text-[#14b8a6]">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-8">
                <input
                  ref={otpRef}
                  type="text"
                  maxLength={4}
                  placeholder="••••"
                  className="w-full border-b border-slate-300 bg-transparent pb-3 text-center text-4xl font-semibold tracking-[0.6em] text-[#0f172a] placeholder-slate-300 focus:border-[#14b8a6] focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                className="group mt-10 flex w-full items-center justify-center gap-2 rounded-md bg-[#14b8a6] py-3 text-sm font-semibold text-white transition-all hover:bg-[#0d9488] hover:shadow-lg"
              >
                Verify
                <span className="translate-x-0 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-lg font-semibold text-red-600">
                OTP expired
              </p>
              <button
                onClick={handleResendOtp}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#14b8a6] hover:text-[#0d9488] transition-colors"
              >
                Go back to signup
                <span className="text-base">↺</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
