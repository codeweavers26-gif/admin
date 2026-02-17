import { addProduct, deactivateProduct, getProduct, updateProduct } from "@/src/services/authService/authService";
import { Box, Button, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel, } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';

interface Product {
  id: string;
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
  id: "",
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

export default function ProductPage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<Product>(initalProduct);
  const [open, setOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(() => [
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "brand", header: "Brand" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "mrp", header: "MRP" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "stock", header: "Stock" },
    { accessorKey: "weight", header: "Weight" },
    { accessorKey: "length", header: "Length" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "height", header: "Height" },
    { accessorKey: "short_description", header: "Short Description" },
    { accessorKey: "discount_percent", header: "Discount %" },
    { accessorKey: "tax_percent", header: "Tax %" },
    { accessorKey: "delivery_days", header: "Delivery Days" },
    { accessorKey: "returnable", header: "Returnable", Cell: ({ row }) => row.original.returnable ? "Yes" : "No", },
    { accessorKey: "cod_available", header: "COD Available", Cell: ({ row }) => row.original.cod_available ? "Yes" : "No", },
    { accessorKey: "actions", header: "", Cell: ({ row }) => (<Button variant="contained" color="error" size="small" onClick={() => handleDeactivate(row.original.id)} startIcon={<BlockIcon />} />), },

  ], []);

  const table = useMantineReactTable({
    columns,
    data: products,
    rowCount: products.length,
    manualPagination: true,
    // onPaginationChange: setPagination,
    // state: { pagination, isLoading: loading },
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    initialState: {
      density: 'xs',
    },
    mantineTableContainerProps: {
      sx: { maxHeight: "80vh", overflowX: "auto" },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => {
        setProduct(row.original);
        setIsEdit(true);
        setOpen(true);
      },
      style: { cursor: "pointer" },
    }),
  });

  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    setLoading(true);
    try {
      const res = await getProduct();

      if (res) {
        setProducts(res)
      }
    } catch (err) {
      console.error("Error getting Products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...product,
        images: product.images.length ? product.images : ["string"],
      };

      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await addProduct(payload);
      }

      setOpen(false);
      setProduct(initalProduct);
      setIsEdit(false);
      getData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeactivate = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirm) return;

    try {
      await deactivateProduct(id);
      getData(); // refresh table after success
    } catch (error) {
      console.error("Error deactivating product:", error);
    }
  };

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setProduct(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));
          setImagePreviews(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    e.target.value = '';
  }, []);

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" >
          <Button variant="contained" sx={{ mt: -3 }} onClick={() => { setProduct(initalProduct); setImagePreviews([]); setIsEdit(false); setOpen(true); }}>
            Add Product
          </Button>
        </Box>
        <Box mt={1} sx={{ height: "75vh" }}>
          <MantineReactTable table={table} />
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? "Update Product" : "Add Product"}</DialogTitle>

        <DialogContent dividers>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <TextField
              label="Name"
              value={product.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
            />
            <TextField
              label="Brand"
              value={product.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              fullWidth
            />
            <TextField
              label="SKU"
              value={product.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              fullWidth
            />
            <TextField
              label="Slug"
              value={product.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              fullWidth
            />
            <TextField
              label="MRP"
              value={product.mrp}
              onChange={(e) => handleChange("mrp", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Price"
              value={product.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Stock"
              value={product.stock}
              onChange={(e) => handleChange("stock", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Weight"
              value={product.weight}
              onChange={(e) => handleChange("weight", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Length"
              value={product.length}
              onChange={(e) => handleChange("length", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Width"
              value={product.width}
              onChange={(e) => handleChange("width", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Height"
              value={product.height}
              onChange={(e) => handleChange("height", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Discount %"
              value={product.discount_percent}
              onChange={(e) => handleChange("discount_percent", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Tax %"
              value={product.tax_percent}
              onChange={(e) => handleChange("tax_percent", Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Delivery Days"
              value={product.delivery_days}
              onChange={(e) => handleChange("delivery_days", Number(e.target.value))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={product.returnable}
                  onChange={(e) =>
                    handleChange("returnable", e.target.checked)
                  }
                />
              }
              label="Returnable"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={product.cod_available}
                  onChange={(e) =>
                    handleChange("cod_available", e.target.checked)
                  }
                />
              }
              label="COD Available"
            />
            {/* <Button variant="outlined" component="label">
              Upload Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            <Box gridColumn="span 2" display="flex" gap={2} flexWrap="wrap">
              {product.images.map((img, index) => (
                <Box key={index} position="relative">
                  <img
                    src={img}
                    alt="product"
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      minWidth: 24,
                      padding: 0,
                    }}
                    onClick={() =>
                      setProduct((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    ✕
                  </Button>
                </Box>
              ))}
            </Box> */}

            <Box gridColumn="span 2">
              <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                📸 Upload Images (Multiple)
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {imagePreviews.length > 0 && (
                <Box display="flex" gap={2} flexWrap="wrap" sx={{ mb: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative" width={120}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '2px solid #e0e0e0'
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          minWidth: 32,
                          width: 32,
                          height: 32,
                          padding: 0,
                        }}
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}

              <Typography variant="body2" color="text.secondary">
                {imagePreviews.length} images selected
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>


    </>
  )
}