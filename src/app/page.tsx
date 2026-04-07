"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin, sendOtpApi, userRegisterApi, verifyOtpApi, } from "../services/authService/authService";

type AuthMode = "password" | "otp";
type OtpStep = "input" | "verify";

export default function LoginPage() {
  const router = useRouter();

  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [otpContact, setOtpContact] = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("input");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!document.getElementById("loader-css")) {
      const style = document.createElement("style");
      style.id = "loader-css";
      style.textContent = `
        .loader-custom {
          display: inline-block !important;
          width: 22px !important; height: 22px !important;
          border-radius: 50% !important;
          position: relative !important;
          animation: rotate 1s linear infinite !important;
        }
        .loader-custom::before, .loader-custom::after {
          content: "" !important; box-sizing: border-box !important;
          position: absolute !important; inset: 0px !important;
          border-radius: 50% !important;
          border: 3px solid rgba(255,255,255,0.8) !important;
          animation: prixClipFix 2s linear infinite !important;
        }
        .loader-custom::after {
          border-color: #f59e0b !important;
          animation: prixClipFix 2s linear infinite, rotate 0.5s linear infinite reverse !important;
          inset: 2px !important; border-width: 2px !important;
        }
        @keyframes rotate { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes prixClipFix {
          0%   { clip-path: polygon(50% 50%,0 0,0 0,0 0,0 0,0 0) }
          25%  { clip-path: polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0) }
          50%  { clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%) }
          75%  { clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%) }
          100% { clip-path: polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0) }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // --- Timer ---
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(30);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    []
  );

  // --- Password submit ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      if (isRegister) {
        await userRegisterApi({ email, password, name: "User" });
        alert("Register success. Please login.");
        setIsRegister(false);
      } else {
        const res = await adminLogin({ email, password });
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(isRegister ? "Register failed" : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // --- OTP: Send ---
  const handleSendOtp = async () => {
    if (!otpContact.trim()) return;
    setOtpLoading(true);
    setError("");
    try {
      await sendOtpApi({ identifier: otpContact });
      setOtpStep("verify");
      startTimer();
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // --- OTP: Verify ---
  const handleVerifyOtp = async () => {
    const code = otpDigits.join("");
    if (code.length < 6) return;
    setOtpLoading(true);
    setError("");
    try {
      const res = await verifyOtpApi({ identifier: otpContact, otp: code });
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      router.push("/dashboard");
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // --- OTP digit handlers ---
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      const code = otpDigits.join("");
      if (code.length === 6) {
        handleVerifyOtp();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = ["", "", "", "", "", ""];
    pasted.split("").forEach((ch, i) => {
      updated[i] = ch;
    });
    setOtpDigits(updated);
    const focusIdx = Math.min(pasted.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const resetOtp = () => {
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpStep("input");
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setError("");
    resetOtp();
  };

  const otpFilled = otpDigits.every((d) => d !== "");
  const formatTimer = (s: number) => `0:${s < 10 ? "0" : ""}${s}`;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Title */}
        <h2 style={styles.title}>
          {isRegister ? "Create account" : "Welcome back"}
        </h2>
        <p style={styles.subtitle}>
          {isRegister
            ? "Fill in your details to get started"
            : "Sign in to continue to your dashboard"}
        </p>

        {/* Toggle */}
        <div style={styles.toggleWrap}>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(authMode === "password"
                ? styles.toggleBtnActive
                : styles.toggleBtnInactive),
            }}
            onClick={() => switchMode("password")}
          >
            Password
          </button>
          <button
            type="button"
            style={{
              ...styles.toggleBtn,
              ...(authMode === "otp"
                ? styles.toggleBtnActive
                : styles.toggleBtnInactive),
            }}
            onClick={() => switchMode("otp")}
          >
            OTP
          </button>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* ── PASSWORD FORM ── */}
        {authMode === "password" && (
          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...styles.input, paddingRight: "72px" }}
                />
                <button
                  type="button"
                  style={styles.inputSuffix}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                ...(loading ? styles.btnDisabled : {}),
              }}
            >
              {loading ? (
                <span style={styles.spinnerRow}>
                  <span className="loader-custom" />
                </span>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* ── OTP FORM ── */}
        {authMode === "otp" && (
          <div style={styles.form}>
            {/* Step 1 */}
            {otpStep === "input" && (
              <>
                <div style={styles.field}>
                  <label style={styles.label}>Email Or Mobile number</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder="Email or Mobile number"
                      value={otpContact}
                      onChange={(e) => setOtpContact(e.target.value)}
                      style={{ ...styles.input, paddingRight: "96px" }}
                      onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !otpContact.trim()}
                  style={{
                    ...styles.btn,
                    ...(!otpContact.trim() || otpLoading
                      ? styles.btnDisabled
                      : {}),
                  }}
                >
                  {otpLoading ? (
                    <span style={styles.spinnerRow}>
                      <span className="loader-custom" />
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </>
            )}

            {/* Step 2 */}
            {otpStep === "verify" && (
              <>
                <div style={styles.sentInfo}>
                  <span style={styles.sentInfoText}>OTP sent to</span>
                  <span style={styles.sentInfoContact}>{otpContact}</span>
                  <button
                    type="button"
                    style={styles.changeBtn}
                    onClick={resetOtp}
                  >
                    Change
                  </button>
                </div>

                <div style={styles.otpRow} onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      style={{
                        ...styles.otpBox,
                        ...(digit ? styles.otpBoxFilled : {}),
                      }}
                    />
                  ))}
                </div>

                <div style={styles.resendRow}>
                  {canResend ? (
                    <span style={styles.resendText}>Didn't receive it?</span>
                  ) : (
                    <span style={styles.resendText}>
                      Resend in{" "}
                      <span style={styles.timerText}>
                        {formatTimer(timer)}
                      </span>
                    </span>
                  )}
                  <button
                    type="button"
                    style={{
                      ...styles.resendBtn,
                      ...(!canResend ? styles.resendBtnDisabled : {}),
                    }}
                    disabled={!canResend}
                    onClick={() => {
                      setOtpDigits(["", "", "", "", "", ""]);
                      startTimer();
                      setTimeout(() => otpRefs.current[0]?.focus(), 50);
                    }}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={!otpFilled || otpLoading}
                  style={{
                    ...styles.btn,
                    ...(!otpFilled || otpLoading ? styles.btnDisabled : {}),
                  }}
                >
                  {otpLoading ? (
                    <span style={styles.spinnerRow}>
                      <span className="loader-custom" />
                    </span>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <p style={styles.footerText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={styles.footerLink}
            onClick={() => {
              setIsRegister((v) => !v);
              setError("");
            }}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(15, 23, 42, 0.92)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)",
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#f8fafc",
  },
  subtitle: {
    margin: "0 0 28px 0",
    fontSize: "14px",
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.5,
  },

  // Toggle
  toggleWrap: {
    display: "flex",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "14px",
    padding: "4px",
    marginBottom: "28px",
    gap: "4px",
  },
  toggleBtn: {
    flex: 1,
    padding: "10px 0",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "10px",
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    outline: "none",
  },
  toggleBtnActive: {
    background: "linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)",
    color: "#fff",
    boxShadow: "0 4px 14px rgba(234,179,8,0.35)",
  },
  toggleBtnInactive: {
    background: "transparent",
    color: "rgba(255,255,255,0.35)",
  },

  // Form
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    fontSize: "15px",
    outline: "none",
    background: "rgba(248,250,252,0.07)",
    color: "#f1f5f9",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  inputSuffix: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "13px",
    fontWeight: 600,
    color: "#eab308",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    padding: 0,
  },

  // OTP
  sentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  sentInfoText: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.35)",
  },
  sentInfoContact: {
    fontSize: "13px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.8)",
    flex: 1,
  },
  changeBtn: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#eab308",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },
  otpRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "space-between",
  },
  otpBox: {
    flex: 1,
    maxWidth: "52px",
    aspectRatio: "1",
    textAlign: "center",
    fontSize: "22px",
    fontWeight: 700,
    fontFamily: "inherit",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    background: "rgba(248,250,252,0.06)",
    color: "#f1f5f9",
    outline: "none",
    caretColor: "#eab308",
  },
  otpBoxFilled: {
    borderColor: "rgba(234,179,8,0.6)",
    background: "rgba(234,179,8,0.07)",
  },
  resendRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resendText: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.35)",
  },
  timerText: {
    fontVariantNumeric: "tabular-nums",
    fontWeight: 600,
    color: "rgba(255,255,255,0.6)",
  },
  resendBtn: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#eab308",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },
  resendBtnDisabled: {
    color: "rgba(255,255,255,0.2)",
    cursor: "not-allowed",
  },

  // Main CTA button
  btn: {
    width: "100%",
    padding: "15px",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    background: "linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)",
    boxShadow: "0 8px 24px rgba(234,179,8,0.28)",
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // Error
  error: {
    color: "#fee2e2",
    padding: "12px 16px",
    borderRadius: "12px",
    borderLeft: "4px solid #ef4444",
    marginBottom: "4px",
    background: "rgba(239,68,68,0.15)",
    fontSize: "14px",
  },

  // Footer
  footerText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    marginTop: "24px",
    fontSize: "14px",
  },
  footerLink: {
    color: "#f8fafc",
    fontWeight: 700,
    cursor: "pointer",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
  },
};
