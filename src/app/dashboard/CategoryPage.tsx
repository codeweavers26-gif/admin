import { addCategory, getCategories } from "@/src/services/authService/authService";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface CategoryPageProps {
  sectionId: string;
  onOpenSubCategory: (categoryId: string) => void;
}

interface Category {
  id: string;
  name: string;
  isActive: boolean
}

interface CreateCategory {
  name: string;
  active: boolean;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "isActive", headerName: "Active", flex: 1, renderCell: (params) => (params.value ? "Yes" : "No") },
];

export default function CategoryPage({ sectionId, onOpenSubCategory }: CategoryPageProps) {

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CreateCategory>({ name: "", active: true });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getCategoriesData();
  }, [])

  const getCategoriesData = async () => {
    setLoading(true);
    try {
      const res = await getCategories(sectionId);
      if (res) {
        setCategories(res.content);
      }
    } catch (error) {
      console.error("Error getting Categories", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: keyof CreateCategory, value: any) => {
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
        sectionId: sectionId,
        active: formData.active
      };

      await addCategory(payload);

      setFormData({ name: "", active: true });
      setOpenModal(false);

      await getCategoriesData();

    } catch (error) {
      console.error("Error creating Category:", error);
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
          <Button variant="contained" onClick={() => setOpenModal(true)} >
            Add Category
          </Button>
        </Box>
        <DataGrid
          rows={categories}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          // paginationModel={paginationModel}
          // onPaginationModelChange={setPaginationModel}
          rowCount={categories.length}
          onRowDoubleClick={(params) => onOpenSubCategory(params.row.id)}
          localeText={{ noRowsLabel: "No records found" }}
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent sx={{ p: 3 }}>

          <TextField
            fullWidth
            label="Category Name"
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
            {submitLoading ? <CircularProgress size={20} /> : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}