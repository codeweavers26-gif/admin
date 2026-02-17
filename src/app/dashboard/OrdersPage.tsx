import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { cancelOrder, getOrders, getUsers, updateOrderStatus } from "../../services/authService/authService";
import { Close } from "@mui/icons-material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface OrderType {
  orderId: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: Array<{
    imageUrl: string;
    price: number;
    productId: number;
    productName: string;
    quantity: number;
    totalPrice: number;
  }>;
  // id: string;
}

type BasicFilters = {
  status: string;
  userId: string;
  orderId: string;
  email: string;
  from: string;
  to: string;
}
const initialFiltersValue: BasicFilters = {
  status: "",
  userId: "",
  orderId: "",
  email: "",
  from: "",
  to: ""
}

export default function UserPage() {

  const [orderList, setOrdersList] = useState<OrderType[]>([]);
  const [basicFilters, setBasicFilters] = useState<BasicFilters>(initialFiltersValue);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);

  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [itemsDialogOpen, setItemsDialogOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 120 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "totalAmount", headerName: "Total Amount", width: 180 },
    { field: "createdAt", headerName: "Created At", width: 250 },
    {
      field: "actions",
      headerName: "",
      width: 340,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleViewItems(params.row)}
            sx={{ minWidth: 90 }}
          >
            View Items
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => openStatusModal(params.row)}
          >
            Update Status
          </Button>
          <Button onClick={() => handleCancelOrder(params.row.orderId)}>
            {/* Cancel Order */}
            <DeleteForeverIcon color='error' />
          </Button>
        </>
      )
    }
  ];

  const getOrdersData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: paginationModel.page.toString(),
        size: paginationModel.pageSize.toString()
      });

      Object.entries(basicFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const res = await getOrders('0', '100');

      if (res) {
        const transformedRows = (res.content || []).map((order: any, index: number) => ({
          ...order,
          id: order.orderId || `row-${index}`,
          itemsCount: (order.items || []).length
        }));
        setOrdersList(transformedRows);
        setRowCount(res.totalElements || 0);
      }
    } catch (error) {
      console.error("Error getting Orders", error);
      setOrdersList([]);
    } finally {
      setLoading(false);
    }
  }, [basicFilters, paginationModel]);

  const handleViewItems = (row: OrderType) => {
    setSelectedOrder(row);
    setItemsDialogOpen(true);
  };

  const handleCloseItemsDialog = () => {
    setItemsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId: string) => {
    // const confirmed = window.confirm("Are you sure you want to cancel this order?");
    // if (!confirmed) return;

    try {
      setLoading(true);
      await cancelOrder(orderId);

      getOrdersData();
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      setLoading(false);
    }
  };

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<OrderType | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const openStatusModal = (order: OrderType) => {
    setStatusOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleConfirmStatusUpdate = async (orderId: string, status: string) => {
    try {
      setLoading(true);
      const payload = {
        status: newStatus
      }
      await updateOrderStatus(orderId, payload);
      setStatusDialogOpen(false);
      getOrdersData();
    } catch (error) {
      console.error("Failed to update order status", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        <TextField
          select
          label="Status"
          size="small"
          className="filter-label-font"
          value={basicFilters.status}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, status: e.target.value })
          }
          sx={{ width: 130 }}
        >
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="shipped">Shipped</MenuItem>
          <MenuItem value="delivered">Delivered</MenuItem>
          <MenuItem value="canceled">Canceled</MenuItem>
          <MenuItem value="placed">Placed</MenuItem>
          <MenuItem value="return_requested">Return Requested</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
        <TextField
          label="User ID"
          size="small"
          className="filter-label-font"
          value={basicFilters.userId}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, userId: e.target.value })
          }
          sx={{ width: 130 }}
        />
        <TextField
          label="Order ID"
          size="small"
          className="filter-label-font"
          sx={{ width: 130 }}
          value={basicFilters.orderId}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, orderId: e.target.value })
          }
        />
        <TextField
          label="Email"
          size="small"
          className="filter-label-font"
          sx={{ width: 130 }}
          value={basicFilters.email}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, email: e.target.value })
          }
        />
        <TextField
          label="From"
          size="small"
          className="filter-label-font"
          sx={{ width: 130 }}
          value={basicFilters.from}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, from: e.target.value })
          }
        />
        <TextField
          label="To"
          size="small"
          className="filter-label-font"
          sx={{ width: 130 }}
          value={basicFilters.to}
          onChange={(e) =>
            setBasicFilters({ ...basicFilters, to: e.target.value })
          }
        />
        <Button variant="contained" className="app-btn-sm" onClick={getOrdersData}>
          Search
        </Button>
      </Stack>
      <Box sx={{ height: 600 }}>
        <DataGrid
          rows={orderList}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: () => (
              <Stack p={4} spacing={2} alignItems="center">
                <Typography>No orders found</Typography>
                <Button onClick={getOrdersData} variant="outlined" size="small">
                  Refresh
                </Button>
              </Stack>
            )
          }}
          sx={{
            // ✅ DISABLE ALL HOVER EFFECTS
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'transparent !important'
            },
            '& .MuiDataGrid-row.Mui-hovered': {
              backgroundColor: 'transparent !important'
            },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
      </Box>
      <Dialog
        open={itemsDialogOpen}
        onClose={handleCloseItemsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ p: 3, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              Order #{selectedOrder?.orderId}
            </Typography>

            {/* ✅ CLOSE BUTTON */}
            <IconButton
              onClick={handleCloseItemsDialog}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  color: 'text.primary'
                }
              }}
              aria-label="Close dialog"
            >
              <Close />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {selectedOrder?.items?.length || 0} items |
            Total: ₹{selectedOrder?.items?.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString() || '0'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0, maxHeight: 500 }}>
          <Stack divider={<Divider />}>
            {selectedOrder?.items?.map((item, index) => (
              <Box key={index} sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={item.imageUrl}
                    sx={{ width: 56, height: 56 }}
                    variant="square"
                  >
                    {item.productName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {item.quantity} | Unit Price: ₹{item.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    ₹{item.totalPrice.toLocaleString()}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="placed">Placed</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="return_requested">Return Requested</MenuItem>
          </TextField>

          <Stack direction="row" justifyContent="flex-end" spacing={1} mt={3}>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => handleConfirmStatusUpdate(statusOrder!.orderId, newStatus)}
            >
              Update
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
