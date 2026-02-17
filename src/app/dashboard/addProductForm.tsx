import { Close } from "@mui/icons-material";
import { Box, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, IconButton, Stack, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  // itm_id: string;
}
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

const AddProductForm: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  // itm_id
}) => {
  const [product, setProduct] = useState<Product>(initalProduct)
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   fetchMapping();
  // }, [open]);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  // const fetchMapping = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await getPriceListItemMappingData(itm_id);
  //     if (response?.data) {
  //       setPriceListItemMapping(response.data);
  //       setRowCount(response.data.total_elements || 0);
  //     } else {
  //       setPriceListItemMapping([]);
  //     }
  //     // }
  //   } catch {
  //     setPriceListItemMapping([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
        <Stack direction="row" alignItems="center" justifyContent="space-between" className="modal-header">
          <DialogTitle sx={{ mt: 1 }}>Item Mapping</DialogTitle>
          <IconButton size="small" onClick={onClose} sx={{ mr: 3, color: 'white' }}>
            <Close />
          </IconButton>
        </Stack>
        <DialogContent>
          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Name"
                size="small"
                value={product.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Brand"
                size="small"
                value={product.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="SKU"
                size="small"
                value={product.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Slug"
                size="small"
                value={product.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Description"
                size="small"
                value={product.description}
                onChange={(e) => handleChange("description", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="MRP"
                size="small"
                value={product.mrp}
                onChange={(e) => handleChange("mrp", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Price"
                size="small"
                value={product.price}
                onChange={(e) => handleChange("price", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Stock"
                size="small"
                value={product.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Weight"
                size="small"
                value={product.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Length"
                size="small"
                value={product.length}
                onChange={(e) => handleChange("length", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Width"
                size="small"
                value={product.width}
                onChange={(e) => handleChange("width", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Height"
                size="small"
                value={product.height}
                onChange={(e) => handleChange("height", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Short Description"
                size="small"
                value={product.short_description}
                onChange={(e) => handleChange("short_description", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Discount Percent"
                size="small"
                value={product.discount_percent}
                onChange={(e) => handleChange("discount_percent", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Tax Percent"
                size="small"
                value={product.tax_percent}
                onChange={(e) => handleChange("tax_percent", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Delivery Days"
                size="small"
                value={product.delivery_days}
                onChange={(e) => handleChange("delivery_days", e.target.value)}
                fullWidth
              />
            </Grid>
            <FormControlLabel
              label="Returnable"
              control={
                <Checkbox
                  checked={!!product.returnable}
                  onChange={(e) => handleChange("returnable", e.target.checked)}
                />
              }
            />
            <FormControlLabel
              label="COD Available"
              control={
                <Checkbox
                  checked={!!product.cod_available}
                  onChange={(e) => handleChange("cod_available", e.target.checked)}
                />
              }
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddProductForm;