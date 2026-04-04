"use client";
import { useEffect, useState } from "react";
import {
  Box, Typography, Chip, CircularProgress, Tooltip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, InputLabel, FormControl, Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getCatalogCategories, getCatalogSections, addCatalogCategory, updateCatalogCategory, deleteCatalogCategory } from "@/src/services/authService/authService";

interface CatalogSection {
  id: number;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

interface CatalogCategory {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  sectionId: number;
}

export default function CatalogMainPage() {
  const [sections, setSections] = useState<CatalogSection[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [selectedSection, setSelectedSection] = useState<CatalogSection | null>(null);
  const [catLoading, setCatLoading] = useState(false);

  // --- Add Category Modal State ---
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSectionId, setNewCatSectionId] = useState<number | "">("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");



  const [editCatDialogOpen, setEditCatDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<CatalogCategory | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSectionId, setEditCatSectionId] = useState<number | "">("");
  const [editCatActive, setEditCatActive] = useState(true);
  const [editCatLoading, setEditCatLoading] = useState(false);
  const [editCatError, setEditCatError] = useState("");
  const [editCatSuccess, setEditCatSuccess] = useState("");

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await getCatalogSections();
      if (res) setSections(res);
    } catch (err) {
      console.error("Error fetching catalog sections", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (sectionId: number) => {
    setCatLoading(true);
    try {
      const res = await getCatalogCategories(sectionId);
      if (res) setCategories(res);
    } catch (err) {
      console.error("Error fetching categories", err);
    } finally {
      setCatLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setNewCatSectionId(selectedSection?.id ?? "");
    setNewCatName("");
    setAddError("");
    setAddSuccess("");
    setAddDialogOpen(true);
  };

  const handleOpenEditCategory = (cat: CatalogCategory) => {
    setEditCategory(cat);
    setEditCatName(cat.name);
    setEditCatSectionId(cat.sectionId);
    setEditCatActive(cat.isActive);
    setEditCatError("");
    setEditCatSuccess("");
    setEditCatDialogOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      setAddError("Category name is required.");
      return;
    }
    if (newCatSectionId === "") {
      setAddError("Please select a section.");
      return;
    }

    setAddLoading(true);
    setAddError("");
    setAddSuccess("");

    try {
      await addCatalogCategory({ name: newCatName.trim(), sectionId: newCatSectionId as number });
      setAddSuccess("Category added successfully!");

      if (selectedSection?.id === newCatSectionId) {
        fetchCategories(newCatSectionId as number);
      }

      setTimeout(() => setAddDialogOpen(false), 1000);
    } catch (err) {
      console.error("Error adding category", err);
      setAddError("Failed to add category. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCatName.trim()) {
      setEditCatError("Category name is required");
      return;
    }
    if (editCatSectionId === "") {
      setEditCatError("Please select section");
      return;
    }
    if (!editCategory) return;
    setEditCatLoading(true);
    setEditCatError("");
    try {
      await updateCatalogCategory(editCategory.id, {
        name: editCatName,
        sectionId: editCatSectionId,
        isActive: editCatActive,
      });

      setEditCatSuccess("Category updated successfully!");
      if (selectedSection) {
        fetchCategories(selectedSection.id);
      }
      setTimeout(() => setEditCatDialogOpen(false), 1000);
    } catch (err) {
      console.error(err);
      setEditCatError("Failed to update category");
    } finally {
      setEditCatLoading(false);
    }
  };

  const handleDeleteCategory = async (cat: any) => {
    const confirmDelete = window.confirm(`Delete "${cat.name}"?`);
    if (!confirmDelete) return;

    try {
      await deleteCatalogCategory(cat.id);
      fetchCategories(cat.sectionId);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <CategoryIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Catalog Sections</Typography>
        </Box>

        {/* Add Category Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(102,126,234,0.35)",
            "&:hover": { boxShadow: "0 6px 16px rgba(102,126,234,0.5)" },
          }}
        >
          Add Category
        </Button>
      </Box>

      {/* Sections Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 3 }}>
        {sections.length === 0 ? (
          <Typography color="text.secondary">No sections found.</Typography>
        ) : (
          sections.map((section) => (
            <Box
              key={section.id}
              onClick={() => { setSelectedSection(section); fetchCategories(section.id); }}
              sx={{
                background: "#fff",
                borderRadius: 3,
                border: selectedSection?.id === section.id ? "2px solid #667eea" : "1px solid #e2e8f0",
                boxShadow: selectedSection?.id === section.id
                  ? "0 10px 25px rgba(102,126,234,0.25)"
                  : "0 4px 12px rgba(0,0,0,0.08)",
                overflow: "hidden",
                cursor: "pointer",
                transform: "translateY(0)",
                transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                component="img"
                src={section.imageUrl}
                alt={section.name}
                onError={(e: any) => { e.target.src = "https://placehold.co/400x200?text=No+Image"; }}
                sx={{ width: "100%", height: 140, objectFit: "cover" }}
              />
              <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={600} fontSize={15} noWrap title={section.name}>
                  {section.name}
                </Typography>
                <Chip
                  label={section.isActive ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    background: section.isActive ? "#22c55e" : "#94a3b8",
                    color: "#fff", fontWeight: 600, fontSize: 11, ml: 1,
                  }}
                />
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Categories Section */}
      {selectedSection && (
        <Box mt={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Categories — {selectedSection.name}
            </Typography>
            <Tooltip title="Clear">
              <IconButton
                size="small"
                onClick={() => { setSelectedSection(null); setCategories([]); }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {catLoading ? (
            <CircularProgress size={28} />
          ) : categories.length === 0 ? (
            <Typography color="text.secondary">No categories found.</Typography>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
              {categories.map((cat) => (
                <Box
                  key={cat.id}
                  sx={{
                    background: "#fff",
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    p: 2.5,
                    minHeight: 120,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    // alignItems: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s",
                    transform: "translateY(0)",
                    "&:hover": {
                      transform: "translateY(-5px) scale(1.01)",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Tooltip title="Delete Category">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCategory(cat)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit Category">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEditCategory(cat)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Typography fontWeight={600} fontSize={18}>{cat.name}</Typography>
                    <Typography fontSize={15} color="text.secondary">{cat.slug}</Typography>
                  </Box>
                  <Box mt={1}>
                    <Chip
                      label={cat.isActive ? "Active" : "Inactive"}
                      size="small"
                      sx={{
                        background: cat.isActive ? "#22c55e" : "#94a3b8",
                        color: "#fff", fontWeight: 600, fontSize: 14,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── Add Category Dialog ── */}
      <Dialog
        open={addDialogOpen}
        onClose={() => !addLoading && setAddDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Add New Category
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "12px !important" }}>
          {addError && <Alert severity="error" sx={{ borderRadius: 2 }}>{addError}</Alert>}
          {addSuccess && <Alert severity="success" sx={{ borderRadius: 2 }}>{addSuccess}</Alert>}

          <TextField
            label="Category Name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            fullWidth
            size="small"
            disabled={addLoading}
            autoFocus
          />

          <FormControl fullWidth size="small" disabled={addLoading}>
            <InputLabel>Section</InputLabel>
            <Select
              value={newCatSectionId}
              label="Section"
              onChange={(e) => setNewCatSectionId(e.target.value as number)}
            >
              {sections.map((sec) => (
                <MenuItem key={sec.id} value={sec.id}>{sec.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setAddDialogOpen(false)}
            disabled={addLoading}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCategory}
            disabled={addLoading}
            startIcon={addLoading ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            {addLoading ? "Adding..." : "Add Category"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editCatDialogOpen}
        onClose={() => !editCatLoading && setEditCatDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Update Category
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {editCatError && <Alert severity="error">{editCatError}</Alert>}
          {editCatSuccess && <Alert severity="success">{editCatSuccess}</Alert>}

          <TextField
            label="Category Name"
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Section</InputLabel>
            <Select
              value={editCatSectionId}
              label="Section"
              onChange={(e) => setEditCatSectionId(e.target.value as number)}
            >
              {sections.map((sec) => (
                <MenuItem key={sec.id} value={sec.id}>
                  {sec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={editCatActive}
                onChange={(e) => setEditCatActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditCatDialogOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdateCategory}
            disabled={editCatLoading}
          >
            {editCatLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}