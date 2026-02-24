import { addInventory, getInventories, getLowStockInventories, getOutOfStockInventories, updateInventory } from "@/src/services/authService/authService";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";

interface Inventory {
  inventoryId: string;
  productId: string;
  productName: string;
  locationId: string;
  locationName: string;
  stock: string;
}

interface AddInventoryForm {
  productId: string;
  locationId: string;
  stock: string;
}

const initialForm: AddInventoryForm = {
  productId: "",
  locationId: "",
  stock: "",
};

export default function InventoryPage() {

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formData, setFormData] = useState<AddInventoryForm>(initialForm);
  const [loading, setLoading] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [updatedStock, setUpdatedStock] = useState("");

  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(() => [
    { accessorKey: "inventoryId", header: "Inventory ID" },
    { accessorKey: "productId", header: "Product ID" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "locationId", header: "Location ID" },
    { accessorKey: "locationName", header: "Location Name" },
    { accessorKey: "stock", header: "Stock" },
    {
      accessorKey: "actions",
      header: "",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setSelectedInventory(row.original);
            setUpdatedStock(row.original.stock);
            setOpenUpdateModal(true);
          }}
        >
          Update
        </Button>
      ),
    }
  ], []);

  const table = useMantineReactTable({
    columns,
    data: inventory,
    rowCount: inventory.length,
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

  useEffect(() => {
    getInventoryData();
  }, []);

  const getInventoryData = async () => {
    // setLoading(true);
    try {
      const res = await getInventories();
      if (res) {
        setInventory(res.content || []);
      }
    } catch (error) {
      console.error("Error getting Inventory Data", error);
      setInventory([]);
    } finally {
      // setLoading(false);
    }
  };
  const SearchOutOfStockInventory = async () => {
    // setLoading(true);
    try {
      const res = await getOutOfStockInventories();
      if (res) {
        setInventory(res || []);
      }
    } catch (error) {
      console.error("Error getting Out of Stock Data", error);
      setInventory([]);
    } finally {
      // setLoading(false);
    }
  };
  const SearchLowStockInventory = async () => {
    // setLoading(true);
    try {
      const res = await getLowStockInventories();
      if (res) {
        setInventory(res.content || []);
      }
    } catch (error) {
      console.error("Error getting Low Stock Data", error);
      setInventory([]);
    } finally {
      // setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AddInventoryForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddInventory = async () => {

    const payload = {
      productId: parseInt(formData.productId),
      locationId: parseInt(formData.locationId),
      stock: parseInt(formData.stock),
    };

    setLoading(true);
    try {
      await addInventory(payload);
      setOpenAddModal(false);
      setFormData(initialForm);
      getInventoryData();
    } catch (error) {
      console.error("Error adding inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedInventory) return;

    const payload = {
      delta: updatedStock,
    };

    setLoading(true);
    try {
      await updateInventory(selectedInventory.inventoryId, payload);

      setOpenUpdateModal(false);
      setSelectedInventory(null);
      setUpdatedStock("");
      getInventoryData();
    } catch (error) {
      console.error("Error updating stock:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" >
          <Stack gap={2} display="flex" direction='row'>
            <Button variant="contained" sx={{ mt: -3 }} onClick={getInventoryData} disabled={loading}>
              All Inventory
            </Button>
            <Button variant="contained" sx={{ mt: -3 }} onClick={SearchOutOfStockInventory} disabled={loading}>
              Out of Stock
            </Button>
            <Button variant="contained" sx={{ mt: -3 }} onClick={SearchLowStockInventory} disabled={loading}>
              Low Stock
            </Button>
            <Button variant="contained" sx={{ mt: -3 }} onClick={() => { setFormData(initialForm); setOpenAddModal(true); }} disabled={loading} >
              Add Inventory
            </Button>
          </Stack>
        </Box>
        <Box mt={1} sx={{ height: "75vh" }}>
          <MantineReactTable table={table} />
        </Box>
      </Box>

      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Inventory</DialogTitle>
        <DialogContent sx={{ p: 3 }}>

          <TextField
            label="Product ID *"
            value={formData.productId}
            onChange={(e) => handleInputChange("productId", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            type="number"
          />

          <TextField
            label="Location ID *"
            value={formData.locationId}
            onChange={(e) => handleInputChange("locationId", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            type="number"
          />

          <TextField
            label="Stock Quantity *"
            value={formData.stock}
            onChange={(e) => handleInputChange("stock", e.target.value)}
            fullWidth
            type="number"
          // inputProps={{ min: 0 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => {
              setOpenAddModal(false);
              setFormData(initialForm);
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddInventory}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Inventory"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Stock</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Product Name"
            value={selectedInventory?.productName || ""}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />

          <TextField
            label="Current Stock"
            value={updatedStock}
            onChange={(e) => setUpdatedStock(e.target.value)}
            type="number"
            fullWidth
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpenUpdateModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateStock}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Stock"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}