import { addLocation, deactivateLocation, getLocations, updateLocation } from "@/src/services/authService/authService";
import { useEffect, useMemo, useState } from "react";
import { Box, TextField, Checkbox, FormControlLabel, Button, Modal } from "@mui/material";
import BlockIcon from '@mui/icons-material/Block';
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";


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
    { accessorKey: "actions", header: "", Cell: ({ row }) => (<Button variant="contained" color="error" size="small" onClick={() => handleDeactivate(row.original.id)} startIcon={<BlockIcon />} />), },
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
      "Are you sure you want to deactivate this product?"
    );

    if (!confirm) return;

    try {
      await deactivateLocation(id);
      getLocationsData();
    } catch (error) {
      console.error("Error deactivating location:", error);
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
    </>
  )
}