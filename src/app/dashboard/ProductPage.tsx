"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Typography, Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, TextField, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable, } from "mantine-react-table";
import type { ExpandedState } from '@tanstack/react-table';
import { activateProductbyId, addImages, addVarients, deactivateProductbyId, deactivateVariantById, getProduct, getProductById, uploadVariantImage } from "@/src/services/authService/authService";
import AddIcon from '@mui/icons-material/Add';
import AddProductPage from "./addProduct";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import { toQueryParams } from "@/src/utls/queryUtils";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  status: string | null;
  id: number;
  name: string;
  brand: string;
  sku: string | null;
  slug: string;
  description: string | null;
  mrp: number | null;
  price: number;
  stock: number;
  returnable: boolean | null;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  attributes: any;
  category: Category;
  variants: any;
  images: any;
  short_description: string;
  discount_percent: number | null;
  tax_percent: number | null;
  in_stock: boolean;
  stock_status: string | null;
  average_rating: number | null;
  total_reviews: number | null;
  cod_available: boolean | null;
  delivery_days: number | null;
  main_image: string;
  thumbnail_image: string;
  medium_image: string | null;
  is_active: boolean;
  created_at: string | null;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalElements, setTotalElements] = useState(0);

  const [variantsMap, setVariantsMap] = useState<Record<number, any[]>>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [openAddModal, setOpenAddModal] = useState(false);

  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  const [variantForm, setVariantForm] = useState({ size: "", color: "", mrp: "", price: "", sellingPrice: "", costPrice: "", initialStock: "" });

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImageProductId, setSelectedImageProductId] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts(pagination.pageIndex, pagination.pageSize);
  }, [pagination]);

  const columns = useMemo<MRT_ColumnDef<Product>[]>(() => [
    {
      id: "variants", header: "Variants",
      Cell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleToggleVariants(row)}
        >
          {row.getIsExpanded() ? "Hide Variants" : "View Variants"}
        </Button>
      ),
    },
    {
      header: "Activate",
      size: 80,
      Cell: ({ row }) => (
        <Tooltip title="Activate">
          <IconButton
            color="primary"
            size="small"
            onClick={() => activateProduct(row.original)}
          >
            <CheckCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      header: "Deactivate",
      size: 80,
      Cell: ({ row }) => (
        <Tooltip title="Deactivate">
          <IconButton
            color="error"
            size="small"
            onClick={() => deactivateProduct(row.original)}
          >
            <BlockIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      header: "Add Variant",
      size: 100,
      Cell: ({ row }) => (
        <Tooltip title="Add Variant">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => {
              setSelectedProductId(row.original.id);
              setVariantDialogOpen(true);
            }}
          >
            <AddCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      header: "Add Images",
      size: 100,
      Cell: ({ row }) => (
        <Tooltip title="Add Images">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => {
              setSelectedImageProductId(row.original.id);
              setImageDialogOpen(true);
            }}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      header: "Delete",
      size: 80,
      Cell: ({ row }) => (
        <Tooltip title="Delete Product">
          <IconButton
            color="error"
            size="small"
            onClick={() => {
              setProductToDelete(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    { accessorKey: "id", header: "ID" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "brand", header: "Brand" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "short_description", header: "Short Description" },
    { accessorKey: "mrp", header: "MRP" },
    { accessorKey: "price", header: "Price", Cell: ({ row }) => `₹${row.original.price}`, },
    { accessorKey: "stock", header: "Stock" },
    {
      accessorKey: "in_stock", header: "In Stock", Cell: ({ row }) => (
        <Chip
          label={row.original.in_stock ? "Yes" : "No"}
          color={row.original.in_stock ? "success" : "error"}
          size="small"
        />
      ),
    },
    { accessorKey: "stock_status", header: "Stock Status" },
    { accessorKey: "returnable", header: "Returnable", Cell: ({ row }) => row.original.returnable !== null ? row.original.returnable ? "Yes" : "No" : "-", },
    { accessorKey: "weight", header: "Weight" },
    { accessorKey: "length", header: "Length" },
    { accessorKey: "width", header: "Width" },
    { accessorKey: "height", header: "Height" },
    { accessorKey: "discount_percent", header: "Discount %" },
    { accessorKey: "tax_percent", header: "Tax %" },
    { accessorKey: "average_rating", header: "Rating", },
    { accessorKey: "total_reviews", header: "Reviews", },
    { accessorKey: "cod_available", header: "COD", Cell: ({ row }) => row.original.cod_available !== null ? row.original.cod_available ? "Yes" : "No" : "-", },
    { accessorKey: "delivery_days", header: "Delivery Days" },
    { accessorKey: "category.name", header: "Category", Cell: ({ row }) => row.original.category?.name || "-", },
    { accessorKey: "category.slug", header: "Category Slug", Cell: ({ row }) => row.original.category?.slug || "-", },
    {
      accessorKey: "is_active", header: "Active", Cell: ({ row }) => (
        <Chip
          label={row.original.is_active ? "Active" : "Inactive"}
          color={row.original.is_active ? "primary" : "default"}
          size="small"
        />
      ),
    },
    { accessorKey: "created_at", header: "Created At", Cell: ({ row }) => row.original.created_at ? new Date(row.original.created_at).toLocaleString() : "-", },
  ], []);

  const table = useMantineReactTable({
    columns,
    data: products,
    enableStickyHeader: true,
    initialState: { density: "xs" },
    enableExpanding: true,
    state: { expanded, pagination, isLoading: loading },
    onExpandedChange: setExpanded,
    manualPagination: true,
    rowCount: totalElements,
    onPaginationChange: setPagination,
    renderDetailPanel: ({ row }) => {
      const productId = row.original.id;
      const variants = variantsMap[productId] || [];

      return (
        <Box sx={{ p: 2, background: "#f8fafc", borderRadius: 2 }}>
          <Typography variant="subtitle2" mb={2} fontWeight={600}>
            Product Variants
          </Typography>

          {variants.length === 0 ? (
            <Typography variant="body2">No variants available</Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2, }}>
              {variants.map((variant: any) => (
                <Box
                  key={variant.id}
                  sx={{
                    p: 2,
                    background: "#ffffff",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  {/* Top Section */}
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={13} fontWeight={600}>
                      {variant.sku}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={variant.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={variant.isActive ? "success" : "default"}
                      />
                      <Tooltip title="Deactivate Variant">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => deactivateVariant(variant.id, productId)}
                        >
                          <BlockIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Variant Image */}
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    {variant.imageUrl ? (
                      <Box
                        component="img"
                        src={variant.imageUrl}
                        sx={{ width: 64, height: 64, objectFit: "cover", borderRadius: 1, border: "1px solid #e2e8f0" }}
                      />
                    ) : (
                      <Box sx={{ width: 64, height: 64, borderRadius: 1, border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <PhotoCameraIcon sx={{ color: "#ccc", fontSize: 24 }} />
                      </Box>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      startIcon={<PhotoCameraIcon />}
                    >
                      {variant.imageUrl ? "Change Image" : "Add Image"}
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            await uploadVariantImage(variant.id, file);
                            alert("Variant image uploaded!");
                            const res = await getProductById(productId);
                            setVariantsMap((prev) => ({ ...prev, [productId]: res?.variants || [] }));
                          } catch (err) {
                            alert("Failed to upload image");
                          }
                        }}
                      />
                    </Button>
                  </Box>

                  {/* Size & Color */}
                  <Box display="flex" gap={2} fontSize={13}>
                    <Typography variant="body2">
                      Size: <b>{variant.size}</b>
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background: variant.color?.toLowerCase(),
                          border: "1px solid #ddd",
                        }}
                      />
                      <Typography variant="body2">
                        {variant.color}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Pricing */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, }}>
                    <Typography fontSize={13}>
                      MRP: ₹{variant.mrp ?? "-"}
                    </Typography>
                    <Typography fontSize={13}>
                      Cost: ₹{variant.costPrice ?? "-"}
                    </Typography>

                    <Typography fontSize={13}>
                      Selling: ₹{variant.sellingPrice ?? "-"}
                    </Typography>
                  </Box>

                  {/* Stock */}
                  <Box mt={1}>
                    <Chip
                      label={`Stock: ${variant.availableStock}`}
                      size="small"
                      color={
                        variant.availableStock < 5 ? "error" : "success"
                      }
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      );
    },

  });

  const fetchProducts = async (pageIndex = 0, pageSize = 10) => {
    setLoading(true);
    try {
      const payload = {
        page: pageIndex,
        size: pageSize,
      };
      const res = await getProduct(toQueryParams(payload));
      if (res?.content) {
        setProducts(res.content);
        setTotalElements(res.totalElements);
      }
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVariants = async (row: any) => {
    const productId = row.original.id;

    if (row.getIsExpanded()) {
      row.toggleExpanded();
      return;
    }

    if (!variantsMap[productId]) {
      try {
        const res = await getProductById(productId);
        setVariantsMap((prev) => ({
          ...prev,
          [productId]: res?.variants || [],
        }));
      } catch (error) {
        console.error("Error fetching variants", error);
      }
    }
    setExpanded((prev) =>
      row.getIsExpanded() ? {} : { [row.id]: true }
    );
  };

  const activateProduct = async (row: any) => {
    setLoading(true)
    try {
      await activateProductbyId(row.id);
      alert("Product Activated Successfully");
    } catch (err) {
      console.log("Got Error", err);
    } finally {
      setLoading(false)
    }
  }

  const handleAddVariant = async () => {
    if (!selectedProductId) return;
    const payload = {
      size: variantForm.size,
      color: variantForm.color,
      mrp: Number(variantForm.mrp),
      price: Number(variantForm.price),
      sellingPrice: Number(variantForm.sellingPrice),
      costPrice: Number(variantForm.costPrice),
      initialStock: Number(variantForm.initialStock),
    };

    try {
      await addVarients(selectedProductId, payload);
      alert("Variant Added Successfully");
      setVariantForm({ size: "", color: "", mrp: "", price: "", sellingPrice: "", costPrice: "", initialStock: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleUploadImages = async () => {
    if (!selectedImageProductId || selectedImages.length === 0) return;

    const formData = new FormData();

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setLoading(true);
      await addImages(selectedImageProductId, formData);
      alert("Images Uploaded Successfully");
      setImageDialogOpen(false);
      setSelectedImages([]);
      fetchProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deactivateProduct = async (row: any) => {
    setLoading(true);
    try {
      await deactivateProductbyId(row.id);
      alert("Product Deactivated Successfully");
      fetchProducts();
    } catch (err) {
      console.log("Got Error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setLoading(true);
    try {
      await deactivateProductbyId(String(productToDelete.id));
      alert(`Product "${productToDelete.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts(pagination.pageIndex, pagination.pageSize);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const deactivateVariant = async (variantId: number, productId: number) => {
    try {
      await deactivateVariantById(variantId);
      alert("Variant Deactivated Successfully");
      const res = await getProductById(productId);
      setVariantsMap((prev) => ({
        ...prev,
        [productId]: res?.variants || [],
      }));
    } catch (err) {
      console.log("Got Error", err);
    }
  };
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Product Management
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              '&:hover': {
                boxShadow: '0 5px 15px 2px rgba(102, 126, 234, .4)',
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
              }
            }}
          >
            Add Product
          </Button>
          <Button
            variant="contained"
            onClick={() => fetchProducts()}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
              boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
              '&:hover': {
                boxShadow: '0 5px 15px 2px rgba(102, 126, 234, .4)',
                background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
              }
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: "75vh" }}>
        <MantineReactTable table={table} />
      </Box>
      {/* product */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        fullWidth
        maxWidth='md'
      >
        <DialogContent sx={{ p: 3 }}>
          <AddProductPage onClose={() => setOpenAddModal(false)} />
        </DialogContent>
      </Dialog>
      {/* varient */}
      <Dialog
        open={variantDialogOpen}
        onClose={() => setVariantDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -3 }}>
          <DialogTitle>Add Product Variant</DialogTitle>
          <IconButton
            onClick={() => setVariantDialogOpen(false)}
            sx={{
              color: 'text.secondary',
              mr: 4,
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
        <DialogContent>
          <Box display="grid" gap={2} mt={1}>
            <TextField
              label="Size"
              value={variantForm.size}
              onChange={(e) => setVariantForm({ ...variantForm, size: e.target.value })} />
            <TextField
              label="Color"
              value={variantForm.color}
              onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })} />

            <TextField
              label="MRP"
              type="number"
              value={variantForm.mrp}
              onChange={(e) => setVariantForm({ ...variantForm, mrp: e.target.value })} />

            <TextField
              label="Price"
              type="number"
              value={variantForm.price}
              onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })} />

            <TextField
              label="Selling Price"
              type="number"
              value={variantForm.sellingPrice}
              onChange={(e) => setVariantForm({ ...variantForm, sellingPrice: e.target.value })} />

            <TextField
              label="Cost Price"
              type="number"
              value={variantForm.costPrice}
              onChange={(e) => setVariantForm({ ...variantForm, costPrice: e.target.value })} />

            <TextField
              label="Initial Stock"
              type="number"
              value={variantForm.initialStock}
              onChange={(e) => setVariantForm({ ...variantForm, initialStock: e.target.value })} />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => setVariantDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleAddVariant}
              >
                Save Variant
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/* images */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -3 }}>
          <DialogTitle>Add Product Images</DialogTitle>
          <IconButton
            onClick={() => setImageDialogOpen(false)}
            sx={{
              color: 'text.secondary',
              mr: 4,
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

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>

            <Button variant="outlined" component="label">
              Select Images
              <input
                hidden
                multiple
                type="file"
                onChange={handleImageSelect}
              />
            </Button>

            {/* Preview */}
            <Box display="flex" gap={2} flexWrap="wrap">
              {selectedImages.map((file, index) => (
                <Box
                  key={index}
                  component="img"
                  src={URL.createObjectURL(file)}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                  }}
                />
              ))}
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                onClick={() => setImageDialogOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleUploadImages}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload Images"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Confirm Delete
          <IconButton size="small" onClick={() => setDeleteDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{productToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            This will deactivate the product and hide it from the store.
          </Typography>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" gap={1} px={3} pb={3}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={loading}
            startIcon={<DeleteIcon />}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
