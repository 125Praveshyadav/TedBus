import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bus,
  Loader2,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../components/context/AuthContext";

const OTP_LENGTH = 6;

const OtpVerification = () => {
  const { email: emailParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { verifyOTP } = useAuth();

  const email = useMemo(() => {
    return decodeURIComponent(location.state?.email || emailParam || "");
  }, [location.state?.email, emailParam]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const otpValue = otp.join("");

  const handleChange = (value, index) => {
    setError("");

    if (!/^\d*$/.test(value)) return;

    const digit = value.slice(-1);

    const nextOtp = [...otp];
    nextOtp[index] = digit;

    setOtp(nextOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedValue = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedValue) return;

    const nextOtp = Array(OTP_LENGTH).fill("");

    pastedValue.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });

    setOtp(nextOtp);

    const nextFocusIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const validateOtp = () => {
    if (!email) {
      setError("Email missing. Please register again.");
      return false;
    }

    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter 6 digit OTP.");
      return false;
    }

    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!validateOtp()) return;

    try {
      setLoading(true);
      setError("");

      const response = await verifyOTP({
        email,
        otp: otpValue,
      });

      toast.success(response?.message || "Account verified successfully 🎉");

      navigate("/login", {
        replace: true,
        state: {
          email,
        },
      });
    } catch (err) {
      const message =
        err?.message ||
        err?.data?.message ||
        "OTP verification failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Backend me abhi resend OTP route nahi hai.
   * Jab route add hoga, is function ko authService.resendOTP se connect karenge.
   */
  const resendOtp = async () => {
    try {
      setResendLoading(true);

      toast.info(
        "Resend OTP API is not added yet. Please register again if OTP expired."
      );

      setTimer(60);
    } catch (err) {
      toast.error(err?.message || "Unable to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        {/* Top */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
          <Link
            to="/register"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-red-600 shadow-lg">
              <Bus className="h-9 w-9" />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight">
              Verify OTP
            </h1>

            <p className="mt-2 text-sm font-semibold text-red-50">
              Enter the verification code sent to your email.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center">
            <MailCheck className="mx-auto h-7 w-7 text-red-600" />

            <p className="mt-2 text-xs font-black uppercase tracking-wider text-red-600">
              OTP sent to
            </p>

            <p className="mt-1 break-all text-sm font-black text-slate-900">
              {email || "Email not found"}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`h-14 w-11 rounded-2xl border-2 bg-slate-50 text-center text-xl font-black text-slate-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 sm:w-12 ${
                    error ? "border-red-300" : "border-slate-200"
                  }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-7 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition ${
                loading
                  ? "cursor-not-allowed bg-slate-200 text-slate-400"
                  : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-sm font-semibold text-slate-500">
                Resend OTP in{" "}
                <span className="font-black text-red-600">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                disabled={resendLoading}
                className="inline-flex items-center justify-center gap-2 text-sm font-black text-red-600 transition hover:text-red-700 hover:underline disabled:opacity-60"
              >
                {resendLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Resend OTP
              </button>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="flex items-start gap-2 text-xs font-bold leading-5 text-green-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              OTP verification helps keep your TedBus account secure.
            </p>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Wrong email?{" "}
            <Link
              to="/register"
              className="font-black text-red-600 transition hover:text-red-700 hover:underline"
            >
              Register again
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default OtpVerification;