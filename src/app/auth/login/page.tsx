"use client";

import { useState } from "react";
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
      <form onSubmit={handleSubmit} style={form}>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={input}
        />

        <button disabled={loading} style={button}>
          {loading
            ? "Please wait..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

        <p style={{ marginTop: 10 }}>
          {isRegister ? "Already have account?" : "New user?"}{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
}

/* styles */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const form = {
  width: 350,
  padding: 30,
  background: "#fff",
  borderRadius: 8,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
};

const button = {
  width: "100%",
  padding: 10,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
};
