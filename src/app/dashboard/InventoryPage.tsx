import { getInventories } from "@/src/services/authService/authService";
import { Box, Button } from "@mui/material";
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

export default function InventoryPage() {

  const [inventory, setInventory] = useState<Inventory[]>([]);

  const columns = useMemo<MRT_ColumnDef<Inventory>[]>(() => [
    { accessorKey: "inventoryId", header: "Inventory ID" },
    { accessorKey: "productId", header: "Product ID" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "locationId", header: "Location ID" },
    { accessorKey: "locationName", header: "Location Name" },
    { accessorKey: "stock", header: "Stock" },
    // { accessorKey: "actions", header: "", Cell: ({ row }) => (<Button variant="contained" color="error" size="small" onClick={() => handleDeactivate(row.original.id)} startIcon={<BlockIcon />} />), },
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
    // mantineTableBodyRowProps: ({ row }) => ({
    //   onDoubleClick: () => {
    //     setFormData(row.original);
    //     setIsEdit(true);
    //     setOpenModal(true);
    //   },
    //   style: { cursor: "pointer" },
    // }),
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
      console.error("Error getting Locations", error);
      setInventory([]);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Box display="flex" justifyContent="flex-end" >
          <Button variant="contained" sx={{ mt: -3 }}>
            Add Location
          </Button>
        </Box>
        <Box mt={1} sx={{ height: "75vh" }}>
          <MantineReactTable table={table} />
        </Box>
      </Box>

    </>
  )
}