"use client";

import { addProduct } from "@/src/services/authService/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  name: string;
  brand: string;
  sku: string;
  slug: string;
  description: string;
  mrp: string;
  price: string;
  stock: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  returnable: boolean;
  images: string[];
  short_description: string;
  discount_percent: string;
  tax_percent: string;
  cod_available: boolean;
  delivery_days: string;
}

const initalProduct: Product = {
  name: "",
  brand: "",
  sku: "",
  slug: "",
  description: "",
  mrp: "",
  price: "",
  stock: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  returnable: true,
  images: [],
  short_description: "",
  discount_percent: "",
  tax_percent: "",
  cod_available: true,
  delivery_days: "",
}

export default function AddProductPage() {
  const router = useRouter();

  // const [name, setName] = useState("");
  // const [price, setPrice] = useState("");
  // const [description, setDescription] = useState("");

  const [product, setProduct] = useState<Product>(initalProduct)

  const handleChange = (field: any, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // const existing =
    //   JSON.parse(localStorage.getItem("products") || "[]");

    // localStorage.setItem(
    //   "products",
    //   JSON.stringify([...existing, newProduct])
    // );

    try {
      const payload = [product]
      const res = await addProduct(payload)
      if (res.status === 200) {
      }
    }
    catch {
      console.error('Error create Product')
    }
    finally {
      router.push("/dashboard");
    }
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
          value={product.name}
          onChange={(e) => handleChange('name', e.target.value)}
          style={input}
        // required
        />

        <input
          placeholder="Brand"
          value={product.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="SKU"
          value={product.sku}
          onChange={(e) => handleChange('sku', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Slug"
          value={product.slug}
          onChange={(e) => handleChange('slug', e.target.value)}
          style={input}
        // required
        />
        <textarea
          placeholder="Description"
          value={product.description}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{ ...input, height: 80 }}
        />
        <input
          placeholder="MRP"
          value={product.mrp}
          onChange={(e) => handleChange('mrp', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Price"
          value={product.price}
          onChange={(e) => handleChange('price', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Stock"
          value={product.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Weight"
          value={product.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Length"
          value={product.length}
          onChange={(e) => handleChange('length', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Width"
          value={product.width}
          onChange={(e) => handleChange('width', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Height"
          value={product.height}
          onChange={(e) => handleChange('height', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Short Description"
          value={product.short_description}
          onChange={(e) => handleChange('short_description', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Discount Percent"
          value={product.discount_percent}
          onChange={(e) => handleChange('discount_percent', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Tax Percent"
          value={product.tax_percent}
          onChange={(e) => handleChange('tax_percent', e.target.value)}
          style={input}
        // required
        />
        <input
          placeholder="Delivery Days"
          value={product.delivery_days}
          onChange={(e) => handleChange('delivery_days', e.target.value)}
          style={input}
        // required
        />
        <div style={checkboxContainer}>
          <label style={checkboxLabel}>
            <input
              type="checkbox"
              checked={product.returnable}
              onChange={(e) => handleChange('returnable', e.target.checked)}
              style={checkbox}
            />
            Returnable
          </label>

          <label style={checkboxLabel}>
            <input
              type="checkbox"
              checked={product.cod_available}
              onChange={(e) => handleChange('cod_available', e.target.checked)}
              style={checkbox}
            />
            COD Available
          </label>
        </div>

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
const checkboxContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  marginBottom: 20,
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  cursor: "pointer",
};

const checkbox: React.CSSProperties = {
  width: 18,
  height: 18,
  margin: 0,
};
