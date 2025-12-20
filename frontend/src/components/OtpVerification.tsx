import { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { saveData } from '../reduxfolder/userSlice';
import type { RootState, AppDispatch } from "../reduxfolder/store";


function OTPVerification(props:any) {
  const otpRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(90); 
  const [isExpired, setIsExpired] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
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
    onSuccess: (data) => {
      dispatch(saveData({name:data.name,email:data.email,id:data.id,isLoggedIn:true}))
      navigate("/", { replace: true });
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
      email: email!,
      otp
    });
    otpRef.current!.value = "";
  };

  const handleResendOtp = () => {
    if(email)navigate(`/verifyotp?email=${encodeURIComponent(email)}`);
    navigate("/");
    
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={() => navigate("/")}
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-slate-800 shadow-2xl border border-slate-700 overflow-hidden">
        <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl bg-gradient-to-r from-teal-500 to-emerald-600 pointer-events-none" />

        <div className="relative p-8">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Verify OTP
            </h2>
            <p className="mt-3 text-sm text-gray-400">
              Code sent to{" "}
              <span className="font-medium text-white">
                {email && email.charAt(0) + "...@" + email.split("@")[1]}
              </span>
            </p>
          </div>

          {!isExpired ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  Expires in
                </span>
                <span className="font-mono text-2xl font-bold text-teal-400">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {error && (
                <div className="mb-6 rounded-lg bg-red-900/40 border border-red-800/50 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="mt-8">
                <input
                  ref={otpRef}
                  type="text"
                  maxLength={4}
                  placeholder="••••"
                  className="w-full px-4 py-4 text-center text-4xl font-bold tracking-widest bg-slate-700/60 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all"
                />
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={verifyOtpMutation.isPending}
                className="w-full mt-8 py-3.5 rounded-xl bg-teal-600 text-white font-semibold text-lg hover:bg-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-600/30"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify'}
              </button>
            </>
          ) : (
            <div className="text-center mt-10">
              <p className="text-xl font-semibold text-red-400">
                OTP has expired
              </p>
              <button
                onClick={handleResendOtp}
                className="mt-6 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Request a new code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;