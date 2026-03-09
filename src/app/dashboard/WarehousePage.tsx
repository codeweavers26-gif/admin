import { addWarehouse, deactivateWarehouse, deleteWarehouse, getWarehouses, updateWarehouse } from "@/src/services/authService/authService";
import { Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

interface Warehouse {
  id: number;
  name: string;
  code: string;
  locationId: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  isDefault: boolean;
  isActive: boolean;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  totalVariants: number;
  totalStock: number;
}
const initailWarehouse = {
  name: "",
  code: "",
  locationId: "",
  address: "",
  city: "", state: "",
  pincode: "",
  contactPerson: "",
  contactPhone: "", contactEmail: "",
  isDefault: false,
  isActive: true,
  latitude: "",
  longitude: "",
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState(initailWarehouse);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(initailWarehouse);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const res = await getWarehouses();
      if (res) setWarehouses(res);
    } catch (err) {
      console.error("Error fetching warehouses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWarehouse = async () => {
    try {
      await addWarehouse(form);
      alert("Warehouse Added Successfully");
      setAddDialogOpen(false);
      setForm(initailWarehouse);
      fetchWarehouses();
    } catch (err) {
      console.error("Error adding warehouse", err);
    }
  };

  const handleOpenEdit = (wh: Warehouse) => {
    setSelectedWarehouseId(wh.id);
    setEditForm({
      name: wh.name, code: wh.code, locationId: String(wh.locationId),
      address: wh.address, city: wh.city, state: wh.state,
      pincode: wh.pincode, contactPerson: wh.contactPerson,
      contactPhone: wh.contactPhone, contactEmail: wh.contactEmail,
      isDefault: wh.isDefault, isActive: wh.isActive,
      latitude: String(wh.latitude), longitude: String(wh.longitude),
    });
    setEditDialogOpen(true);
  };

  const handleUpdateWarehouse = async () => {
    if (!selectedWarehouseId) return;
    try {
      const payload = {
        ...editForm,
        locationId: Number(editForm.locationId),
        latitude: Number(editForm.latitude),
        longitude: Number(editForm.longitude),
      };
      await updateWarehouse(selectedWarehouseId, payload);
      alert("Warehouse Updated Successfully");
      setEditDialogOpen(false);
      fetchWarehouses();
    } catch (err) {
      console.error("Error updating warehouse", err);
    }
  };

  const handleDeactivateWarehouse = async (id: number) => {
    try {
      await deactivateWarehouse(id);
      alert("Warehouse Deactivated Successfully");
      fetchWarehouses();
    } catch (err) {
      console.error("Error deactivating warehouse", err);
    }
  };

  const handleDeleteWarehouse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;
    try {
      await deleteWarehouse(id);
      alert("Warehouse Deleted Successfully");
      fetchWarehouses();
    } catch (err) {
      console.error("Error deleting warehouse", err);
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
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1} >
          <WarehouseIcon color="primary" />
          <Typography variant="h5" fontWeight={600} >Warehouse Management</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            boxShadow: "0 3px 5px 2px rgba(102, 126, 234, .3)",
          }}
        >
          Add Warehouse
        </Button>
      </Box>

      {/* Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 3,
        }}
      >
        {warehouses.map((wh) => (
          <Box
            key={wh.id}
            sx={{
              background: "#fff",
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
              transition: "box-shadow 0.2s",
              "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
            }}
          >
            {/* Card Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize={16} color="#fff">
                  {wh.name}
                </Typography>
                <Typography fontSize={12} color="rgba(255,255,255,0.8)" mt={0.5}>
                  Code: {wh.code}
                </Typography>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
                {wh.isDefault && (
                  <Chip label="Default" size="small" sx={{ background: "#fbbf24", color: "#fff", fontWeight: 600, fontSize: 11 }} />
                )}
                <Chip
                  label={wh.isActive ? "Active" : "Inactive"}
                  size="small"
                  sx={{
                    background: wh.isActive ? "#22c55e" : "#94a3b8",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
                <IconButton size="small" onClick={() => handleOpenEdit(wh)} sx={{ color: "#fff", "&:hover": { background: "rgba(255,255,255,0.2)" } }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeactivateWarehouse(wh.id)} sx={{ color: "#fff", "&:hover": { background: "rgba(255,255,255,0.2)" } }}>
                  <BlockIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteWarehouse(wh.id)} sx={{ color: "#fff", "&:hover": { background: "rgba(255,255,255,0.2)" } }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Card Body */}
            <Box p={2} display="flex" flexDirection="column" gap={1.5}>
              {/* Address */}
              <Box display="flex" gap={1} alignItems="flex-start">
                <LocationOnIcon fontSize="small" sx={{ color: "#64748b", mt: 0.2 }} />
                <Typography fontSize={13} color="#475569">
                  {wh.address}, {wh.city}, {wh.state} - {wh.pincode}
                </Typography>
              </Box>

              {/* Contact Person */}
              <Box display="flex" gap={1} alignItems="center">
                <PersonIcon fontSize="small" sx={{ color: "#64748b" }} />
                <Typography fontSize={13} color="#475569">{wh.contactPerson}</Typography>
              </Box>

              {/* Phone */}
              <Box display="flex" gap={1} alignItems="center">
                <PhoneIcon fontSize="small" sx={{ color: "#64748b" }} />
                <Typography fontSize={13} color="#475569">{wh.contactPhone}</Typography>
              </Box>

              {/* Email */}
              <Box display="flex" gap={1} alignItems="center">
                <EmailIcon fontSize="small" sx={{ color: "#64748b" }} />
                <Typography fontSize={13} color="#475569">{wh.contactEmail}</Typography>
              </Box>

              {/* Divider */}
              <Box sx={{ borderTop: "1px solid #f1f5f9", mt: 0.5 }} />

              {/* Stock Stats */}
              <Box display="flex" justifyContent="space-around">
                <Box textAlign="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <InventoryIcon fontSize="small" sx={{ color: "#667eea" }} />
                    <Typography fontSize={20} fontWeight={700} color="#667eea">
                      {wh.totalVariants}
                    </Typography>
                  </Box>
                  <Typography fontSize={11} color="#94a3b8">Total Variants</Typography>
                </Box>
                <Box sx={{ width: "1px", background: "#f1f5f9" }} />
                <Box textAlign="center">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                    <InventoryIcon fontSize="small" sx={{ color: "#22c55e" }} />
                    <Typography fontSize={20} fontWeight={700} color="#22c55e">
                      {wh.totalStock}
                    </Typography>
                  </Box>
                  <Typography fontSize={11} color="#94a3b8">Total Stock</Typography>
                </Box>
              </Box>

              {/* Updated At */}
              <Typography fontSize={11} color="#cbd5e1" textAlign="right">
                Updated: {new Date(wh.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Add Warehouse</DialogTitle>
          <IconButton onClick={() => setAddDialogOpen(false)} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="grid" gap={2} mt={1}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <TextField label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </Box>
            <TextField label="Location ID" type="number" value={form.locationId} onChange={(e) => setForm({ ...form, locationId: e.target.value })} />
            <TextField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <TextField label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </Box>
            <TextField label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            <TextField label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              <TextField label="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Latitude" type="number" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              <TextField label="Longitude" type="number" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </Box>
            <Box display="flex" gap={3}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                Set as Default
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                Active
              </label>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleAddWarehouse}>Save Warehouse</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Edit Warehouse</DialogTitle>
          <IconButton onClick={() => setEditDialogOpen(false)} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="grid" gap={2} mt={1}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              <TextField label="Code" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
            </Box>
            <TextField label="Location ID" type="number" value={editForm.locationId} onChange={(e) => setEditForm({ ...editForm, locationId: e.target.value })} />
            <TextField label="Address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="City" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
              <TextField label="State" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} />
            </Box>
            <TextField label="Pincode" value={editForm.pincode} onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })} />
            <TextField label="Contact Person" value={editForm.contactPerson} onChange={(e) => setEditForm({ ...editForm, contactPerson: e.target.value })} />
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Contact Phone" value={editForm.contactPhone} onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })} />
              <TextField label="Contact Email" value={editForm.contactEmail} onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })} />
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Latitude" type="number" value={editForm.latitude} onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })} />
              <TextField label="Longitude" type="number" value={editForm.longitude} onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })} />
            </Box>
            <Box display="flex" gap={3}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={editForm.isDefault} onChange={(e) => setEditForm({ ...editForm, isDefault: e.target.checked })} />
                Set as Default
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })} />
                Active
              </label>
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdateWarehouse}>Update Warehouse</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}