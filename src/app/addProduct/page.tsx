"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      name,
      price,
      description,
    };

    const existing =
      JSON.parse(localStorage.getItem("products") || "[]");

    localStorage.setItem(
      "products",
      JSON.stringify([...existing, newProduct])
    );

    router.push("/dashboard");
  };

  return (
    <div style={card}>
      {/* BACK BUTTON */}
      <button onClick={() => router.push("/dashboard")} style={backBtn}>
        ← Back
      </button>

      <h2>Add Product</h2>

      <form onSubmit={handleSave}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={input}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...input, height: 80 }}
        />

        <button type="submit" style={saveBtn}>
          Save Product
        </button>
      </form>
    </div>
  );
}

/* styles */

const card: React.CSSProperties = {
  maxWidth: 500,
  background: "#fff",
  padding: 25,
  borderRadius: 10,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 10,
  marginBottom: 15,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const saveBtn: React.CSSProperties = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const backBtn: React.CSSProperties = {
  marginBottom: 15,
  background: "transparent",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
};
