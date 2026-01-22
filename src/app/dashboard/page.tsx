"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminlogout } from "../../services/authService/authService";
import { useState,useEffect } from "react";

export default function DashboardLayout({


  
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
}
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
  }, []);

  const handleLogout = async () => {
    try {
      await adminlogout({ message: "logout" });
    } catch {}
    finally {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      router.push("/auth/login");
    }
  };



  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <header style={headerStyle}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          RichNRetired
        </div>

        <button onClick={handleLogout} style={logoutBtn}>
          Logout
        </button>
      </header>

      {/* BODY */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <aside style={sidebarStyle}>
          <SidebarItem
            label="Add Product"
            onClick={() => router.push("/addProduct")}
          />
        </aside>

        
      <div style={{ marginTop: 20 }}>
        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {/* CONTENT */}
        <main style={contentStyle}>{children}</main>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} style={sidebarItem}>
      {label}
    </div>
  );
}

/* ---------- styles ---------- */

const headerStyle: React.CSSProperties = {
  height: 60,
  background: "#ffffff",
  borderBottom: "1px solid #ddd",
  padding: "0 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const sidebarStyle: React.CSSProperties = {
  width: 220,
  background: "#f8f8f8",
  padding: 15,
};

const sidebarItem: React.CSSProperties = {
  padding: "12px 14px",
  background: "#fff",
  borderRadius: 8,
  cursor: "pointer",
  marginBottom: 10,
  fontWeight: 500,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: 30,
  background: "#fafafa",
};

const logoutBtn: React.CSSProperties = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};
