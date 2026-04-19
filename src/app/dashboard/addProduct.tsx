"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import SnackBarCx from "@/src/utls/snackbar";
import { addProduct, getSections, getCategories } from "@/src/services/authService/authService";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface AddProductPageProps {
  onClose: () => void;
}

interface ProductForm {
  name: string;
  brand: string;
  sku: string;
  slug: string;
  description: string;
  short_description: string;
  stock: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  returnable: boolean;
  categoryId: string;
  tax_percent: string;
  cod_available: boolean;
  delivery_days: string;
  images: File[];
}

const initialState: ProductForm = {
  name: "",
  brand: "",
  sku: "",
  slug: "",
  description: "",
  short_description: "",
  stock: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  returnable: true,
  categoryId: "",
  tax_percent: "",
  cod_available: true,
  delivery_days: "",
  images: [],
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
  const [loading, setLoading] = useState(false);

  // Section → Category dropdowns
  const [sections, setSections] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    setSectionsLoading(true);
    getSections()
      .then((res: any) => {
        const data = res?.data || res;
        setSections(Array.isArray(data) ? data : []);
      })
      .catch(() => setSections([]))
      .finally(() => setSectionsLoading(false));
  }, []);

  const handleSectionChange = async (sectionId: string) => {
    setSelectedSectionId(sectionId);
    handleChange("categoryId", "");
    setCategories([]);
    if (!sectionId) return;
    setCategoriesLoading(true);
    try {
      const res: any = await getCategories(sectionId);
      const data = res?.data || res;
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

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

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
        short_description: form.short_description,
        stock: Number(form.stock),
        weight: Number(form.weight),
        length: Number(form.length),
        width: Number(form.width),
        height: Number(form.height),
        returnable: form.returnable,
        categoryId: Number(form.categoryId),
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

      setSnackbar({ open: true, message: "Product added successfully!", severity: "success" });
      setForm(initialState);
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

          {/* Section dropdown */}
          <FormControl fullWidth>
            <InputLabel>Section</InputLabel>
            <Select
              value={selectedSectionId}
              label="Section"
              onChange={(e) => handleSectionChange(e.target.value as string)}
              disabled={sectionsLoading}
              endAdornment={sectionsLoading ? <CircularProgress size={18} sx={{ mr: 2 }} /> : null}
            >
              <MenuItem value=""><em>-- Select Section --</em></MenuItem>
              {sections.map((s) => (
                <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category dropdown */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.categoryId}
              label="Category"
              onChange={(e) => handleChange("categoryId", e.target.value)}
              disabled={!selectedSectionId || categoriesLoading}
              endAdornment={categoriesLoading ? <CircularProgress size={18} sx={{ mr: 2 }} /> : null}
            >
              <MenuItem value=""><em>-- Select Category --</em></MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Short Description"
            multiline
            rows={2}
            value={form.short_description}
            onChange={(e) => handleChange("short_description", e.target.value)}
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

      {/* PRICING & STOCK */}
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
          Stock & Delivery
        </Typography>

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <TextField label="Stock" type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)} />

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
