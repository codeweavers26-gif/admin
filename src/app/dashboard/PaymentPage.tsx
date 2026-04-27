"use client";
import {
  Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle,
  Divider, IconButton, MenuItem, Stack, TextField, Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getOrders, updateOrderPaymentStatus } from "../../services/authService/authService";
import { Close } from "@mui/icons-material";

const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED", "COMPLETED", "REFUND_PENDING", "CANCELLED", "PREPAID"];

const statusColor: Record<string, string> = {
  SUCCESS: "#22c55e", COMPLETED: "#22c55e",
  PENDING: "#f59e0b",
  FAILED: "#ef4444", CANCELLED: "#ef4444",
  REFUND_PENDING: "#8b5cf6",
  PREPAID: "#3b82f6",
  COD: "#f97316",
};

interface OrderRow {
  id: number;
  orderId: number;
  userName: string;
  userEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function PaymentPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");

  const [editOrder, setEditOrder] = useState<OrderRow | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: paginationModel.page.toString(),
        size: paginationModel.pageSize.toString(),
      });
      const res = await getOrders(params.toString());
      if (res) {
        let content = (res.content || []).map((o: any) => ({ ...o, id: o.orderId }));
        if (filterPaymentStatus) content = content.filter((o: any) => o.paymentStatus === filterPaymentStatus);
        if (filterPaymentMethod) content = content.filter((o: any) => o.paymentMethod === filterPaymentMethod);
        setRows(content);
        setRowCount(res.totalElements || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [paginationModel]);

  const openEdit = (row: OrderRow) => {
    setEditOrder(row);
    setNewPaymentStatus(row.paymentStatus);
  };

  const handleUpdatePayment = async () => {
    if (!editOrder) return;
    setUpdating(true);
    try {
      await updateOrderPaymentStatus(editOrder.orderId, newPaymentStatus);
      setEditOrder(null);
      fetchOrders();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 90 },
    {
      field: "userName", headerName: "Customer", width: 200,
      renderCell: (p) => (
        <Box>
          <Typography fontSize={13} fontWeight={600}>{p.row.userName}</Typography>
          <Typography fontSize={11} color="text.secondary">{p.row.userEmail}</Typography>
        </Box>
      ),
    },
    {
      field: "paymentMethod", headerName: "Method", width: 120,
      renderCell: (p) => (
        <Chip label={p.value} size="small"
          sx={{ bgcolor: statusColor[p.value] ?? "#94a3b8", color: "#fff", fontWeight: 600, fontSize: 11 }} />
      ),
    },
    {
      field: "paymentStatus", headerName: "Payment Status", width: 150,
      renderCell: (p) => (
        <Chip label={p.value} size="small"
          sx={{ bgcolor: statusColor[p.value] ?? "#94a3b8", color: "#fff", fontWeight: 600, fontSize: 11 }} />
      ),
    },
    {
      field: "status", headerName: "Order Status", width: 140,
      renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" sx={{ fontSize: 11 }} />,
    },
    {
      field: "totalAmount", headerName: "Amount", width: 110,
      renderCell: (p) => <Typography fontSize={13} fontWeight={600}>₹{p.value?.toLocaleString()}</Typography>,
    },
    {
      field: "createdAt", headerName: "Date", width: 160,
      renderCell: (p) => <Typography fontSize={12}>{new Date(p.value).toLocaleString()}</Typography>,
    },
    {
      field: "actions", headerName: "", width: 140, sortable: false,
      renderCell: (p) => (
        <Button size="small" variant="contained" disableElevation onClick={() => openEdit(p.row)}>
          Update Payment
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>Payments</Typography>

      <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
        <TextField select label="Payment Status" size="small" value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)} sx={{ width: 160 }}>
          <MenuItem value="">All</MenuItem>
          {PAYMENT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
        <TextField select label="Method" size="small" value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)} sx={{ width: 130 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="COD">COD</MenuItem>
          <MenuItem value="PREPAID">Prepaid</MenuItem>
        </TextField>
        <Button variant="contained" onClick={fetchOrders}>Search</Button>
      </Stack>

      <Box sx={{ height: 580 }}>
        <DataGrid
          rows={rows} columns={columns} loading={loading}
          paginationMode="server" paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount} pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider",
            "& .MuiDataGrid-row:hover": { backgroundColor: "transparent !important" } }}
        />
      </Box>

      <Dialog open={!!editOrder} onClose={() => setEditOrder(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Update Payment Status
            <IconButton size="small" onClick={() => setEditOrder(null)}><Close /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {editOrder && (
            <Box mb={2} px={1.5} py={1} bgcolor="#f5f5f5" borderRadius={1}>
              <Typography fontSize={12} color="text.secondary">
                Order #{editOrder.orderId} &nbsp;·&nbsp; Method: <strong>{editOrder.paymentMethod}</strong>
                &nbsp;·&nbsp; Current: <strong>{editOrder.paymentStatus}</strong>
              </Typography>
            </Box>
          )}
          <TextField select fullWidth size="small" label="New Payment Status"
            value={newPaymentStatus} onChange={(e) => setNewPaymentStatus(e.target.value)}>
            {PAYMENT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <Stack direction="row" justifyContent="flex-end" spacing={1} mt={3}>
            <Button onClick={() => setEditOrder(null)}>Cancel</Button>
            <Button variant="contained" disabled={updating} onClick={handleUpdatePayment}>
              {updating ? "Saving..." : "Update"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
