import { addSubCategory, getSubCategories, getAllAttribute } from "@/src/services/authService/authService";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography, FormControlLabel, TextField, Divider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";

interface SubCategoryPageProps {
  categoryId: string;
  // onOpenSubCategory: (categoryId: string) => void;
}

interface SubCategory {
  id: string;
  name: string;
  isActive: boolean
}
const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "isActive", headerName: "Active", flex: 1, renderCell: (params) => (params.value ? "Yes" : "No") },
];

interface CreateSubCategory {
  name: string;
  active: boolean;
}

interface Attribute {
  id: string;
  name: string;
  filterable: boolean;
}
export default function SubCategoryPage({ categoryId }: SubCategoryPageProps) {

  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CreateSubCategory>({ name: "", active: true });
  const [submitLoading, setSubmitLoading] = useState(false);

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const columns = useMemo<MRT_ColumnDef<SubCategory>[]>(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "isActive", header: "Active", Cell: ({ row }) => row.original.isActive ? "Yes" : "No", },
  ], []);

  const table = useMantineReactTable({
    columns,
    data: subCategories,
    rowCount: subCategories.length,
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
  });

  const attributeColumns = useMemo<MRT_ColumnDef<Attribute>[]>(() => [
    { accessorKey: "id", header: "ID", size: 120 },
    { accessorKey: "name", header: "Attribute Name", flex: 1 },
  ], []);

  const attributesTable = useMantineReactTable({
    columns: attributeColumns,
    data: attributes,
    rowCount: attributes.length,
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    initialState: {
      density: 'xs',
    },
    mantineTableContainerProps: {
      sx: { maxHeight: "40vh", overflowX: "auto" }, // Half height
    },
  });


  useEffect(() => {
    getSubCategoriesData();
    getAttributesData();
  }, [])

  const getSubCategoriesData = async () => {
    setLoading(true);
    try {
      const res = await getSubCategories(categoryId);
      if (res) {
        setSubCategories(res.content);
      }
    } catch (error) {
      console.error("Error getting SubCategories", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  }
  const getAttributesData = async () => {
    try {
      setLoading(true);
      const res = await getAllAttribute();
      if (res) {
        setAttributes(res.content || res || []);
      }
    } catch (error) {
      console.error("Error getting Attributes", error);
      setAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateSubCategory, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: categoryId,
        active: formData.active
      };

      await addSubCategory(payload);

      setFormData({ name: "", active: true });
      setOpenModal(false);

      await getSubCategoriesData();

    } catch (error) {
      console.error("Error creating SubCategory:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ name: "", active: true });
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Add Sub Category
          </Button>
        </Box>
        <Box mt={1} sx={{ height: "75vh" }}>
          <MantineReactTable table={table} />
        </Box>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Available Attributes ({attributes.length})</Typography>
        </Box>
        <Box sx={{ height: "35vh" }}>
          <MantineReactTable table={attributesTable} />
        </Box>
      </Box>
      {/* </Box > */}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New SubCategory</DialogTitle>
        <DialogContent sx={{ p: 3 }}>

          <TextField
            fullWidth
            label="Sub Category Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <FormControlLabel
            label="Active"
            control={
              <Checkbox
                checked={!!formData.active}
                onChange={(e) => handleChange("active", e.target.checked)}
              />
            }
          />

        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitLoading || !formData.name.trim()}
          >
            {submitLoading ? <CircularProgress size={20} /> : 'Add SubCategory'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}