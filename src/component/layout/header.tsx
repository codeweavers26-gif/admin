"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        height: "45px",
        background: "#b3aec7ff",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h3>Admin Panel</h3>

      <nav style={{ display: "flex", gap: "20px" }}>
        <Link href="auth/login">Login</Link>
      </nav>
    </header>
  );
}
