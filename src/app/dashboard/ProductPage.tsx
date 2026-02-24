import { addProduct, deactivateProduct, getInventorybyProductId, getProduct, updateProduct } from "@/src/services/authService/authService";
import { Box, Button, Drawer, IconButton, Tooltip, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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
  images: File[];
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

  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);


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
    { accessorKey: "actions", header: "Deactivate", Cell: ({ row }) => (<Button variant="contained" color="error" size="small" onClick={() => handleDeactivate(row.original.id)} startIcon={<BlockIcon />} />), },
    {
      id: "inventory",
      header: "Inventory Status",
      // size: 60,
      Cell: ({ row }) => (
        <Tooltip title="View Inventory">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleViewInventory(row.original.id)}
          >
            <Inventory2OutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
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

  // const handleChange = (field: keyof Product, value: any) => {
  //   setProduct((prev) => ({ ...prev, [field]: value }));
  // }

  const handleInputChange = (e: any) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      // const payload = {
      //   ...product,
      //   images: product.images.length ? product.images : ["string"],
      // };

      const formData = new FormData();


      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("sku", product.sku);
      formData.append("slug", product.slug);
      formData.append("description", product.description);
      formData.append("mrp", String(product.mrp));
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("weight", String(product.weight));
      formData.append("length", String(product.length));
      formData.append("width", String(product.width));
      formData.append("height", String(product.height));
      formData.append("short_description", product.short_description);
      formData.append("discount_percent", String(product.discount_percent));
      formData.append("tax_percent", String(product.tax_percent));
      formData.append("delivery_days", String(product.delivery_days));
      formData.append("returnable", String(product.returnable));
      formData.append("cod_available", String(product.cod_available));
      product.images.forEach((file) => {
        formData.append("images", file);
      });

      console.log([...formData.entries()], "formdata");

      if (isEdit) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
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

  const handleViewInventory = async (productId: string) => {
    setInventoryLoading(true);
    setInventoryOpen(true);

    try {
      const res = await getInventorybyProductId(productId);
      if (res) {
        setInventoryData(res);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]);
    } finally {
      setInventoryLoading(false);
    }
  };


  // const [imagePreviews, setImagePreviews] = useState<>([]);


  // const handleImageChange = (e: any) => {
  //   // Convert FileList to array
  //   const files = Array.from(e.target.files);
  //   setImagePreviews(files);
  // };
  // const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files || []);

  //   files.forEach((file) => {
  //     if (file.type.startsWith('image/')) {
  //       setProduct(prev => ({
  //         ...prev,
  //         images: [...prev.images, file]   // store file object
  //       }));

  //       setImagePreviews(prev => [
  //         ...prev,
  //         URL.createObjectURL(file)        // preview only
  //       ]);
  //     }
  //   });

  //   e.target.value = '';
  // }, []);

  // const removeImage = (index: number) => {
  //   setProduct(prev => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index)
  //   }));
  //   setImagePreviews(prev => prev.filter((_, i) => i !== index));
  // };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" >
          <Button variant="contained" sx={{ mt: -3 }} onClick={() => { setProduct(initalProduct); setIsEdit(false); setOpen(true); }}>
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
              // onChange={(e) => handleChange("name", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Brand"
              value={product.brand}
              // onChange={(e) => handleChange("brand", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="SKU"
              value={product.sku}
              // onChange={(e) => handleChange("sku", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Slug"
              value={product.slug}
              // onChange={(e) => handleChange("slug", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              value={product.description}
              // onChange={(e) => handleChange("description", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Short Description"
              value={product.short_description}
              // onChange={(e) => handleChange("short_description", e.target.value)}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="MRP"
              value={product.mrp}
              // onChange={(e) => handleChange("mrp", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Price"
              value={product.price}
              // onChange={(e) => handleChange("price", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Stock"
              value={product.stock}
              // onChange={(e) => handleChange("stock", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Weight"
              value={product.weight}
              // onChange={(e) => handleChange("weight", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Length"
              value={product.length}
              // onChange={(e) => handleChange("length", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Width"
              value={product.width}
              // onChange={(e) => handleChange("width", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Height"
              value={product.height}
              // onChange={(e) => handleChange("height", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Discount %"
              value={product.discount_percent}
              // onChange={(e) => handleChange("discount_percent", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Tax %"
              value={product.tax_percent}
              // onChange={(e) => handleChange("tax_percent", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Delivery Days"
              value={product.delivery_days}
              // onChange={(e) => handleChange("delivery_days", Number(e.target.value))}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={product.returnable}
                  onChange={(e) =>
                    // handleChange("returnable", e.target.checked)
                    handleInputChange
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
                    // handleChange("cod_available", e.target.checked)
                    handleInputChange
                  }
                />
              }
              label="COD Available"
            />

            {/* <Box gridColumn="span 2">
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
            </Box> */}
            {/* <div>
              <label>Images:</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <p>Selected {imagePreviews.length} image(s)</p>
              )}
            </div> */}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Product
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        anchor="right"
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        PaperProps={{ sx: { width: 500, p: 3 } }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            color: "black",
            px: 3,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Inventory Details
          </Typography>

          <IconButton
            onClick={() => setInventoryOpen(false)}
            sx={{
              color: "black",
              width: 36,
              height: 36,
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {inventoryLoading ? (
          <Typography>Loading...</Typography>
        ) : inventoryData.length === 0 ? (
          <Typography>No inventory found</Typography>
        ) : (
          inventoryData.map((inv) => (
            <Box
              key={inv.inventoryId}
              mb={2}
              p={2}
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                background: "#fafafa",
              }}
            >
              <Typography fontWeight={600}>
                {inv.locationName}
              </Typography>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Total Stock: {inv.stock}
                </Typography>
                <Typography variant="body2">
                  Available: {inv.availableStock}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography variant="body2">
                  Reserved: {inv.reservedStock}
                </Typography>
                <Typography variant="body2">
                  Reorder Level: {inv.reorderLevel}
                </Typography>
              </Box>

              <Box mt={1}>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      inv.stockStatus === "OUT_OF_STOCK"
                        ? "error.main"
                        : inv.stockStatus === "LOW_STOCK"
                          ? "warning.main"
                          : "success.main",
                    fontWeight: 600,
                  }}
                >
                  {inv.stockStatus}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary">
                Last Updated:{" "}
                {new Date(inv.lastUpdated).toLocaleString()}
              </Typography>
            </Box>
          ))
        )}
      </Drawer>

    </>
  )
}