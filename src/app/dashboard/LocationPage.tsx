import { addLocation, deactivateLocation, getInventorybyLocId, getLocations, updateLocation } from "@/src/services/authService/authService";
import { useEffect, useMemo, useState } from "react";
import { Box, TextField, Checkbox, FormControlLabel, Button, Modal } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Drawer, Typography, IconButton } from "@mui/material";


interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
  extraShippingCharge: string;
  deliveryDays: string;
  codAvailable: boolean;
}

const initialFormData: Location = {
  id: "",
  name: "",
  city: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  extraShippingCharge: "",
  deliveryDays: "",
  codAvailable: true,
}

export default function LocationPage() {


  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Location>(initialFormData);
  const [openModal, setOpenModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);


  const columns = useMemo<MRT_ColumnDef<Location>[]>(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "pincode", header: "Pincode" },
    { accessorKey: "latitude", header: "Latitude" },
    { accessorKey: "longitude", header: "Longitude" },
    { accessorKey: "deliveryDays", header: "Delivery Days" },
    { accessorKey: "codAvailable", header: "COD Available", Cell: ({ row }) => row.original.codAvailable ? "Yes" : "No", },
    { accessorKey: "extraShippingCharge", header: "Extra Shipping Charge" },
    { accessorKey: "actions", header: "Deactivate", Cell: ({ row }) => (<Button variant="contained" color="error" size="small" onClick={() => handleDeactivate(row.original.id)} startIcon={<BlockIcon />} />), },
    {
      id: "inventory",
      header: "Inventory Status",
      // size: 60,
      Cell: ({ row }) => (
        <IconButton
          size="small"
          color="primary"
          onClick={() => handleViewInventory(row.original)}
        >
          <Inventory2OutlinedIcon fontSize="small" />
        </IconButton>
      ),
    },

  ], []);

  const table = useMantineReactTable({
    columns,
    data: locations,
    rowCount: locations.length,
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
        setFormData(row.original);
        setIsEdit(true);
        setOpenModal(true);
      },
      style: { cursor: "pointer" },
    }),
  });

  useEffect(() => {
    getLocationsData();
  }, []);

  const getLocationsData = async () => {
    setLoading(true);
    try {
      const res = await getLocations();
      if (res) {
        setLocations(res || []);
      }
    } catch (error) {
      console.error("Error getting Locations", error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Location, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true)
    try {
      if (isEdit) {
        await updateLocation(formData.id, formData);
      } else {
        await addLocation(formData);
      }

      setOpenModal(false);
      setFormData(initialFormData);
      setIsEdit(false);
      getLocationsData();
    }
    catch (error) {
      console.error('Error creating Location', error)
    }
    finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate this Location?"
    );

    if (!confirm) return;

    try {
      await deactivateLocation(id);
      getLocationsData();
    } catch (error) {
      console.error("Error deactivating location:", error);
    }
  };

  const handleViewInventory = async (location: Location) => {
    setSelectedLocation(location);
    setInventoryOpen(true);
    setInventoryLoading(true);

    try {
      const res = await getInventorybyLocId(location.id);
      if (res) {
        setInventoryData(res || []);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventoryData([]);
    } finally {
      setInventoryLoading(false);
    }
  };


  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" >
          <Button variant="contained" sx={{ mt: -3 }} onClick={() => { setFormData(initialFormData); setIsEdit(false); setOpenModal(true); }}>
            Add Location
          </Button>
        </Box>
        <Box mt={1} sx={{ height: "75vh" }}>
          <MantineReactTable table={table} />
        </Box>
      </Box>

      {/* Add Location Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          <Box
            sx={{
              gridColumn: "span 2",
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            {isEdit ? "Update Location" : "Add Location"}
          </Box>
          <TextField
            label="Name"
            size="small"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <TextField
            label="City"
            size="small"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          <TextField
            label="State"
            size="small"
            value={formData.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          <TextField
            label="Pincode"
            size="small"
            value={formData.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
          />
          <TextField
            label="Latitude"
            size="small"
            value={formData.latitude}
            onChange={(e) => handleChange("latitude", e.target.value)}
          />
          <TextField
            label="Longitude"
            size="small"
            value={formData.longitude}
            onChange={(e) => handleChange("longitude", e.target.value)}
          />
          <TextField
            label="Delivery Days"
            size="small"
            type="number"
            value={formData.deliveryDays}
            onChange={(e) => handleChange("deliveryDays", e.target.value)}
          />
          <TextField
            label="Extra Shipping Charge"
            size="small"
            value={formData.extraShippingCharge}
            onChange={(e) => handleChange("extraShippingCharge", e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.codAvailable}
                onChange={(e) =>
                  handleChange("codAvailable", e.target.checked)
                }
              />
            }
            label="COD Available"
            sx={{ gridColumn: "span 2" }}
          />

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={1}
            gridColumn="span 2"
          >
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>

      <Drawer
        anchor="right"
        open={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        PaperProps={{ sx: { width: 600 } }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6">
            Inventory - {selectedLocation?.name}
          </Typography>

          <IconButton onClick={() => setInventoryOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box p={2}>
          {inventoryLoading ? (
            <Typography>Loading...</Typography>
          ) : inventoryData.length === 0 ? (
            <Typography>No inventory found</Typography>
          ) : (
            <Box>
              {inventoryData.map((inv) => (
                <Box
                  key={inv.inventoryId}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    background: "#fafafa",
                  }}
                >
                  <Typography fontWeight={600}>
                    {inv.productName}
                  </Typography>

                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap={1}
                    mt={1}
                  >
                    <Typography variant="body2">
                      Stock: {inv.stock}
                    </Typography>
                    <Typography variant="body2">
                      Available: {inv.availableStock}
                    </Typography>
                    <Typography variant="body2">
                      Reserved: {inv.reservedStock}
                    </Typography>
                    <Typography variant="body2">
                      Reorder Level: {inv.reorderLevel}
                    </Typography>
                  </Box>

                  <Typography
                    mt={1}
                    sx={{
                      fontWeight: 600,
                      color:
                        inv.stockStatus === "OUT_OF_STOCK"
                          ? "error.main"
                          : inv.stockStatus === "LOW_STOCK"
                            ? "warning.main"
                            : "success.main",
                    }}
                  >
                    {inv.stockStatus}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(inv.lastUpdated).toLocaleString()}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Drawer>

    </>
  )
}