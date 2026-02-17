import { addSection, getSections } from "@/src/services/authService/authService";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface Section {
  id: string;
  name: string;
  imageUrl: string;
  isActive?: boolean;
}

interface CreateSection {
  name: string;
  imageUrl: string;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "imageUrl", headerName: "Image", flex: 1,
    renderCell: (params) => (
      <Box
        component="img"
        src={params.value}
        alt={params.row.name}
        sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    )
  },
  { field: "isActive", headerName: "Active", flex: 1, renderCell: (params) => (params.value ? "Yes" : "No") },
];

interface SectionPageProps {
  onOpenCategory: (sectionId: string) => void;
}

export default function SectionPage({ onOpenCategory }: SectionPageProps) {

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<CreateSection>({
    name: "",
    imageUrl: ""
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getSectionsData();
  }, [])

  const getSectionsData = async () => {
    setLoading(true);
    try {
      const res = await getSections();
      if (res) {
        setSections(res.content);
      }
    } catch (error) {
      console.error("Error getting Sections", error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (field: keyof CreateSection, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      return;
    }

    setSubmitLoading(true);

    try {
      const payload: CreateSection = {
        name: formData.name.trim(),
        imageUrl: formData.imageUrl.trim()
      };

      await addSection(payload);

      setFormData({ name: "", imageUrl: "" });
      setOpenModal(false);

      await getSectionsData();

    } catch (error) {
      console.error("Error creating section:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({ name: "", imageUrl: "" });
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Add Section
          </Button>
        </Box>
        <DataGrid
          rows={sections}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          autoHeight
          // paginationModel={paginationModel}
          // onPaginationModelChange={setPaginationModel}
          rowCount={sections.length}
          onRowDoubleClick={(params) => onOpenCategory(params.row.id)}
          localeText={{ noRowsLabel: "No records found" }}
        />
      </Box>

      {/* Add Section Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Section</DialogTitle>
        <DialogContent sx={{ p: 3 }}>

          <TextField
            fullWidth
            label="Section Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange("imageUrl", e.target.value)}
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />

          {formData.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>Preview:</Typography>
              <Box
                component="img"
                src={formData.imageUrl}
                alt="Preview"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseModal} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitLoading || !formData.name.trim() || !formData.imageUrl.trim()}
          >
            {submitLoading ? <CircularProgress size={20} /> : 'Add Section'}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  )
}