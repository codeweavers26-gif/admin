import { addSubCategory, getSubCategories } from "@/src/services/authService/authService";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

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
export default function SubCategoryPage({ categoryId }: SubCategoryPageProps) {

  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CreateSubCategory>({ name: "", active: true });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getSubCategoriesData();
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
        <DataGrid
          rows={subCategories}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          // paginationModel={paginationModel}
          // onPaginationModelChange={setPaginationModel}
          rowCount={subCategories.length}
          // onRowDoubleClick={(params) => onOpenSubCategory(params.row.id)}
          localeText={{ noRowsLabel: "No records found" }}
        />
      </Box>

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