"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import SnackBarCx from "@/src/utls/snackbar";
import { addProduct, getCategories } from "@/src/services/authService/authService";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface AddProductPageProps {
  onClose: () => void;
}

interface Category {
  id: number;
  name: string;
}

interface ProductForm {
  name: string;
  brand: string;
  slug: string;
  description: string;
  mrp: string;
  price: string;
  stock: string;
  categoryId: string;
  short_description: string;
  discount_percent: string;
  tax_percent: string;
  cod_available: boolean;
  delivery_days: string;
  images: File[];
  sku: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  returnable: boolean;
}

const initialState: ProductForm = {
  name: "",
  brand: "",
  slug: "",
  description: "",
  mrp: "",
  price: "",
  stock: "",
  categoryId: "1",
  short_description: "",
  discount_percent: "",
  tax_percent: "",
  cod_available: true,
  delivery_days: "",
  images: [],
  sku: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  returnable: true,
};

type Variant = {
  size: string;
  color: string;
  mrp: string;
  sellingPrice: string;
  costPrice: string;
  initialStock: string;
  profitMargin: string;
};

export default function AddProductPage({ onClose }: AddProductPageProps) {
  const [form, setForm] = useState<ProductForm>(initialState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([
    {
      size: "",
      color: "",
      mrp: "",
      sellingPrice: "",
      costPrice: "",
      initialStock: "",
      profitMargin: "",
    },
  ]);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  // const fetchCategories = async () => {
  //   const res = await getCategories();
  //   if (res) setCategories(res);
  // };

  const handleChange = (field: keyof ProductForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color: "",
        mrp: "",
        sellingPrice: "",
        costPrice: "",
        initialStock: "",
        profitMargin: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleChange("images", files);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const productPayload = {
        name: form.name,
        brand: form.brand,
        sku: form.sku,
        slug: form.slug,
        description: form.description,
        mrp: Number(form.mrp),
        price: Number(form.price),
        stock: Number(form.stock),
        weight: Number(form.weight),
        length: Number(form.length),
        width: Number(form.width),
        height: Number(form.height),
        returnable: form.returnable,
        categoryId: Number(form.categoryId),
        short_description: form.short_description,
        discount_percent: Number(form.discount_percent),
        tax_percent: Number(form.tax_percent),
        cod_available: form.cod_available,
        delivery_days: Number(form.delivery_days),
        variants: variants.map((v) => ({
          size: v.size,
          color: v.color,
          mrp: Number(v.mrp),
          sellingPrice: Number(v.sellingPrice),
          costPrice: Number(v.costPrice),
          initialStock: Number(v.initialStock),
          profitMargin: Number(v.profitMargin),
        })),
      };

      const formData = new FormData();

      formData.append(
        "product",
        new Blob([JSON.stringify(productPayload)], {
          type: "application/json",
        })
      );

      form.images.forEach((file) => {
        formData.append("images", file);
      });

      await addProduct(formData);

      // alert("Product Added Successfully");
      setSnackbar({ open: true, message: "Product added successfully!", severity: "success" });
      setForm(initialState);
      // onClose();
      setTimeout(() => {
        setForm(initialState);
        onClose();
      }, 3500);
    } catch (err: any) {
      console.error(err);
      setSnackbar({ open: true, message: err?.message || "Failed to add product.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 4,
        background: "#f8fafc",
        borderRadius: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Add New Product
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              backgroundColor: 'rgba(244, 67, 54, 0.1)'
            }
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* BASIC INFO */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Basic Information
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
          <TextField label="Name" value={form.name}
            onChange={(e) => handleChange("name", e.target.value)} />

          <TextField label="Brand" value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)} />

          <TextField label="Slug" value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)} />

          <TextField label="SKU" value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)} />

          <TextField
            label="Short Description"
            multiline
            rows={2}
            value={form.short_description}
            onChange={(e) => handleChange("short_description", e.target.value)}
            sx={{ gridColumn: "span 2" }}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            sx={{ gridColumn: "span 2" }}
          />
        </Box>
      </Box>

      {/* PRICING */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Pricing & Stock
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <TextField label="MRP" type="number"
            value={form.mrp}
            onChange={(e) => handleChange("mrp", e.target.value)} />

          <TextField label="Price" type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)} />

          <TextField label="Stock" type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)} />

          <TextField label="Discount %" type="number"
            value={form.discount_percent}
            onChange={(e) => handleChange("discount_percent", e.target.value)} />

          <TextField label="Tax %" type="number"
            value={form.tax_percent}
            onChange={(e) => handleChange("tax_percent", e.target.value)} />

          <TextField label="Delivery Days" type="number"
            value={form.delivery_days}
            onChange={(e) => handleChange("delivery_days", e.target.value)} />
        </Box>
      </Box>

      {/* DIMENSIONS */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Dimensions
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <TextField label="Weight" type="number"
            value={form.weight}
            onChange={(e) => handleChange("weight", e.target.value)} />

          <TextField label="Length" type="number"
            value={form.length}
            onChange={(e) => handleChange("length", e.target.value)} />

          <TextField label="Width" type="number"
            value={form.width}
            onChange={(e) => handleChange("width", e.target.value)} />

          <TextField label="Height" type="number"
            value={form.height}
            onChange={(e) => handleChange("height", e.target.value)} />
        </Box>
      </Box>

      {/* VARIANTS */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={600}>Product Variants</Typography>

          <Button variant="outlined" onClick={addVariant}>
            Add Variant
          </Button>
        </Box>

        {variants.map((variant, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
            }}
          >
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
              <TextField
                label="Size"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
              />

              <TextField
                label="Color"
                value={variant.color}
                onChange={(e) =>
                  handleVariantChange(index, "color", e.target.value)
                }
              />

              <TextField
                label="MRP"
                type="number"
                value={variant.mrp}
                onChange={(e) =>
                  handleVariantChange(index, "mrp", e.target.value)
                }
              />

              <TextField
                label="Selling Price"
                type="number"
                value={variant.sellingPrice}
                onChange={(e) =>
                  handleVariantChange(index, "sellingPrice", e.target.value)
                }
              />

              <TextField
                label="Cost Price"
                type="number"
                value={variant.costPrice}
                onChange={(e) =>
                  handleVariantChange(index, "costPrice", e.target.value)
                }
              />

              <TextField
                label="Initial Stock"
                type="number"
                value={variant.initialStock}
                onChange={(e) =>
                  handleVariantChange(index, "initialStock", e.target.value)
                }
              />

              <TextField
                label="Profit Margin"
                type="number"
                value={variant.profitMargin}
                onChange={(e) =>
                  handleVariantChange(index, "profitMargin", e.target.value)
                }
              />
            </Box>

            <Box mt={1} textAlign="right">
              <Button
                color="error"
                size="small"
                onClick={() => removeVariant(index)}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* SETTINGS */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
          display: "flex",
          gap: 4,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={form.cod_available}
              onChange={(e) => handleChange("cod_available", e.target.checked)}
            />
          }
          label="COD Available"
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.returnable}
              onChange={(e) => handleChange("returnable", e.target.checked)}
            />
          }
          label="Returnable"
        />
      </Box>

      {/* IMAGES */}
      <Box
        sx={{
          background: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          mb: 3,
        }}
      >
        <Typography fontWeight={600} mb={2}>
          Product Images
        </Typography>

        <Button
          variant="outlined"
          component="label"
          sx={{ mb: 2 }}
        >
          Upload Images
          <input hidden multiple type="file" onChange={handleImageChange} />
        </Button>

        <Box display="flex" gap={2} flexWrap="wrap">
          {form.images.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 110,
                height: 110,
              }}
            >
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                }}
              />

              <IconButton
                size="small"
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  background: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    background: "#fee2e2",
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* SUBMIT */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background:
              "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            boxShadow:
              "0 4px 15px rgba(102, 126, 234, .3)",
            "&:hover": {
              background:
                "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
            },
          }}
        >
          {loading ? "Saving..." : "Add Product"}
        </Button>
      </Box>

      <SnackBarCx
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
