import { Box, Button, Stack, TextField } from "@mui/material";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import { useState, useMemo } from "react";
import { getOrdersByUserId, getReturnsByUserId, getUsers } from "../../services/authService/authService";
import { Drawer, Loader, Text } from "@mantine/core";
import { IconButton, Tooltip } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { toQueryParams } from "@/src/utls/queryUtils";

interface UserType {
  role: string;
  name: string;
  email: string;
  createdAt: string;
  id: string;
}

type BasicFilters = {
  search: string;
  fromDate: string;
  toDate: string;
}
const initialFiltersValue: BasicFilters = {
  search: "",
  fromDate: "",
  toDate: ""
}

export default function UserPage() {

  const [users, setUsers] = useState<UserType[]>([]);
  const [basicFilters, setBasicFilters] = useState<BasicFilters>(initialFiltersValue);
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const [returns, setReturns] = useState<any[]>([]);
  const [returnsLoading, setReturnsLoading] = useState(false);


  const columns = useMemo<MRT_ColumnDef<UserType>[]>(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "createdAt", header: "Created At" },
    {
      header: "Actions",
      size: 80,
      Cell: ({ row }) => (
        <Tooltip title="View Orders">
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleViewOrders(row.original)}
          >
            <ReceiptLongIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], []);


  const table = useMantineReactTable({
    columns,
    data: users,
    rowCount: users.length,
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

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const payload = {
        search: basicFilters.search,
        fromDate: basicFilters.fromDate,
        toDate: basicFilters.toDate,
      }
      // const queryParam = toQueryParams(payload)
      const res = await getUsers();

      if (res) {
        setUsers(res.content)
      }
    } catch {
      console.error("Error getting Users");
    } finally {
      setLoading(false);
    }
  }

  const handleViewOrders = async (user: UserType) => {
    setSelectedUser(user);
    setDrawerOpened(true);

    setOrdersLoading(true);
    setReturnsLoading(true);

    try {
      const [ordersRes, returnsRes] = await Promise.all([
        getOrdersByUserId(user.id),
        getReturnsByUserId(user.id),
      ]);

      if (ordersRes) {
        setOrders(ordersRes.content);
      }

      if (returnsRes) {
        setReturns(returnsRes.content);
      }
    } catch (err) {
      console.error("Error fetching orders/returns");
    } finally {
      setOrdersLoading(false);
      setReturnsLoading(false);
    }
  };


  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          label="Name"
          size="small"
          className="filter-label-font"
          value={basicFilters.search}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, search: e.target.value })
          }
        />
        <TextField
          label="From Date(YYYY-MM-DD)"
          size="small"
          className="filter-label-font"
          value={basicFilters.fromDate}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, fromDate: e.target.value })
          }
        />
        <TextField
          label="To Date(YYYY-MM-DD)"
          size="small"
          className="filter-label-font"
          value={basicFilters.toDate}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, toDate: e.target.value })
          }
        />
        <Button variant="contained" className="app-btn-sm" onClick={fetchUserData}>
          Search
        </Button>
      </Stack>
      <Box mt={1} sx={{ height: "75vh" }}>
        <MantineReactTable table={table} />
      </Box>
      {/* <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title={`Orders - ${selectedUser?.name || ""}`}
        position="right"
        size="lg"
      >
        {ordersLoading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <Text>No orders found</Text>
        ) : (
          orders.map((order) => (
            <Box
              key={order.orderId}
              mb={2}
              p={2}
              sx={{ border: "1px solid #ddd", borderRadius: 4 }}
            >
              <div><strong>Order ID:</strong> {order.orderId}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Payment:</strong> {order.paymentStatus}</div>
              <div><strong>Total:</strong> ₹{order.totalAmount}</div>
              <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
            </Box>
          ))
        )}
      </Drawer> */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title={`UserName - ${selectedUser?.name || ""}`}
        position="right"
        size="lg"
      >
        {/* ---------------- ORDERS SECTION ---------------- */}
        <Box mb={4}>
          <h3>Orders</h3>

          {ordersLoading ? (
            <Loader size="sm" />
          ) : orders.length === 0 ? (
            <Text size="sm">No orders found</Text>
          ) : (
            orders.map((order) => (
              <Box
                key={order.orderId}
                mb={2}
                p={2}
                sx={{ border: "1px solid #e0e0e0", borderRadius: 6 }}
              >
                <div><strong>Order ID:</strong> {order.orderId}</div>
                <div><strong>Status:</strong> {order.status}</div>
                <div><strong>Total:</strong> ₹{order.totalAmount}</div>
                <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
              </Box>
            ))
          )}
        </Box>

        {/* ---------------- RETURNS SECTION ---------------- */}
        <Box>
          <h3>Returns</h3>

          {returnsLoading ? (
            <Loader size="sm" />
          ) : returns.length === 0 ? (
            <Text size="sm">No returns found</Text>
          ) : (
            returns.map((ret) => (
              <Box
                key={ret.returnId}
                mb={2}
                p={2}
                sx={{ border: "1px solid #ffdddd", borderRadius: 6 }}
              >
                <div><strong>Return ID:</strong> {ret.returnId}</div>
                <div><strong>Product:</strong> {ret.productName}</div>
                <div><strong>Quantity:</strong> {ret.quantity}</div>
                <div><strong>Status:</strong> {ret.status}</div>
                <div><strong>Refund:</strong> ₹{ret.refundAmount}</div>
                <div><strong>Requested:</strong> {new Date(ret.requestedAt).toLocaleString()}</div>
              </Box>
            ))
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
