"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminLogin,
  userRegisterApi,
} from "../../../services/authService/authService";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!document.getElementById('loader-css')) {
      const style = document.createElement('style');
      style.id = 'loader-css';
      style.textContent = `
      .loader-custom {
        display: inline-block !important;
        width: 24px !important;
        height: 24px !important;
        border-radius: 50% !important;
        position: relative !important;
        animation: rotate 1s linear infinite !important;
      }
      
      .loader-custom::before,
      .loader-custom::after {
        content: "" !important;
        box-sizing: border-box !important;
        position: absolute !important;
        inset: 0px !important;
        border-radius: 50% !important;
        border: 3px solid rgba(255,255,255,0.8) !important;
        animation: prixClipFix 2s linear infinite !important;
      }
      
      .loader-custom::after {
        border-color: #f59e0b !important;
        animation: prixClipFix 2s linear infinite, rotate 0.5s linear infinite reverse !important;
        inset: 2px !important;
        border-width: 2px !important;
      }

      @keyframes rotate {
        0% { transform: rotate(0deg) }
        100% { transform: rotate(360deg) }
      }

      @keyframes prixClipFix {
        0% { clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0) }
        25% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0) }
        50% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%) }
        75% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%) }
        100% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0) }
      }
    `;
      document.head.appendChild(style);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (isRegister) {
        await userRegisterApi({
          email,
          password,
          name: "User",
        });

        alert("Register success. Please login.");
        setIsRegister(false);
      } else {
        const res = await adminLogin({
          email,
          password,
        });

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

  return (
    <div style={container}>
      <div style={form}>
        {/* Animated Title */}
        <h2 style={title}>{isRegister ? "Welcome Back" : "Sign In"}</h2>

        {/* Error Alert */}
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formContent}>
          {/* Email Field */}
          <div style={inputWrapper}>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // style={{ ...input, ...inputActive(email.length > 0) }}
              style={input}
              id="email"
            />
            {/* <label htmlFor="email" style={labelStyle(email.length > 0)}>Email Address</label> */}
          </div>

          {/* Password Field */}
          <div style={inputWrapper}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // style={{ ...input, ...inputActive(password.length > 0) }}
              style={input}
              id="password"
            />
            {/* <label htmlFor="password" style={labelStyle(password.length > 0)}>Password</label> */}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...button, // Base styles
              ...(loading ? buttonDisabled : buttonActive), // ONE conditional spread
            }}
          >
            {loading ? (
              <span style={spinnerContainer}>
                <span className="loader-custom" style={loaderStyle} />
              </span>
            ) : (
              isRegister ? "Create Account" : "Sign In"
            )}
          </button>

        </form>

        {/* Toggle Link */}
        <p style={toggleText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={toggleLink}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
/* ✨ Modern Styles */
const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  // background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)",
};

const form = {
  width: "100%",
  maxWidth: 420,
  padding: "40px",
  // background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  // border: "1px solid rgba(255, 255, 255, 0.2)",
  // boxShadow: "0 25px 45px rgba(0,0,0,0.1)",
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(59, 130, 246, 0.3)",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
};

const title: React.CSSProperties = {
  margin: "0 0 32px 0",
  // color: "#fff",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  textAlign: "center",
  color: "#f8fafc",
  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
};

const formContent: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const inputWrapper: React.CSSProperties = {
  position: "relative",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "20px 16px 8px 16px",
  border: "2px solid rgba(255,255,255,0.3)",
  borderRadius: "16px",
  fontSize: "16px",
  outline: "none",
  background: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
};

const inputActive = (active: boolean): React.CSSProperties => ({
  borderColor: active ? "#667eea" : "rgba(255, 255, 255, 0.3)",
  boxShadow: active ? "0 0 0 4px rgba(102, 126, 234, 0.1)" : "none",
  transform: active ? "translateY(-2px)" : "none",
} as const);

const labelStyle = (active: boolean): React.CSSProperties => ({
  position: "absolute" as const,
  left: "20px",
  top: active ? "12px" : "20px",
  fontSize: active ? "12px" : "16px",
  color: active ? "#667eea" : "rgba(255, 255, 255, 0.7)",
  pointerEvents: "none",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  fontWeight: active ? 600 : 500,
} as const);

const button = {
  width: "100%",
  padding: "16px",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: "linear-gradient(135deg, #eab308 0%, #f59e0b 50%, #d97706 100%)",
};

const buttonActive: React.CSSProperties = {
  transform: "translateY(-2px)",
  boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
};

const buttonDisabled: React.CSSProperties = {
  opacity: 0.9,
  cursor: "not-allowed",
  transform: "none",
};


const spinnerContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "center",
};

// const spinner = {
//   width: "20px",
//   height: "20px",
//   border: "2px solid rgba(255,255,255,0.3)",
//   borderTop: "2px solid #fff",
//   borderRadius: "50%",
//   animation: "spin 1s linear infinite",
// };

const loaderStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  position: 'relative' as const,
  animation: 'rotate 1s linear infinite'
};

// CSS for pseudo-elements and keyframes (add to global CSS or styled-components)
const loaderCSS = `
  .loader-custom::before,
  .loader-custom::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #FFF;
    animation: prixClipFix 2s linear infinite;
  }
  
  .loader-custom::after {
    border-color: #FF3D00;
    animation: prixClipFix 2s linear infinite, rotate 0.5s linear infinite reverse;
    inset: 6px;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }

  @keyframes prixClipFix {
    0% { clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0) }
    25% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0) }
    50% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%) }
    75% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%) }
    100% { clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0) }
  }
`;

const errorStyle = {
  // background: "rgba(239, 68, 68, 0.2)",
  color: "#fee2e2",
  padding: "12px 16px",
  borderRadius: "12px",
  borderLeft: "4px solid #ef4444",
  marginBottom: "20px",
  backdropFilter: "blur(10px)",
  background: "rgba(239, 68, 68, 0.15)",
  borderLeftColor: "#ef4444",
};

const toggleText: React.CSSProperties = {
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.8)",
  marginTop: "24px",
  fontSize: "15px",
};

const toggleLink = {
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  background: "linear-gradient(45deg, #fff, #f0f0ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  transition: "all 0.3s ease",
  padding: "4px 8px",
  borderRadius: "6px",
  "&:hover": {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    transform: "scale(1.05)",
  },
};


//   return (
//     <div style={container}>
//       <form onSubmit={handleSubmit} style={form}>
//         <h2>{isRegister ? "Register" : "Login"}</h2>

//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={input}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={input}
//         />

//         <button disabled={loading} style={button}>
//           {loading
//             ? "Please wait..."
//             : isRegister
//             ? "Register"
//             : "Login"}
//         </button>

//         <p style={{ marginTop: 10 }}>
//           {isRegister ? "Already have account?" : "New user?"}{" "}
//           <span
//             style={{ color: "blue", cursor: "pointer" }}
//             onClick={() => setIsRegister(!isRegister)}
//           >
//             {isRegister ? "Login" : "Register"}
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }

// /* styles */

// const container = {
//   minHeight: "100vh",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const form = {
//   width: 350,
//   padding: 30,
//   background: "#fff",
//   borderRadius: 8,
// };

// const input = {
//   width: "100%",
//   padding: 10,
//   marginBottom: 15,
// };

// const button = {
//   width: "100%",
//   padding: 10,
//   background: "#4f46e5",
//   color: "#fff",
//   border: "none",
// };
