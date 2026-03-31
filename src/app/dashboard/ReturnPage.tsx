"use client";
import { useEffect, useState } from "react";
import { Box, Typography, Chip, Tabs, Tab, Tooltip, IconButton, Dialog, DialogContent, DialogTitle, Checkbox, FormControlLabel, Button, TextField } from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import { useMemo } from "react";
import { approveReturn, getAllReturns, getPendingReturns, rejectReturn } from "@/src/services/authService/authService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";

interface ReturnType {
  id: number;
  returnNumber: string;
  status: string;
  reason: string;
  reasonDescription: string;
  quantity: number;
  refundAmount: number;
  restockingFee: number;
  createdAt: string;
  updatedAt: string | null;
  totalRefundAmount: number;
  userId: number;
  orderId: number;
  orderItemId: number;
  productName: string;
  itemPrice: number;
  refundStatus: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  completedAt: string | null;
}

const statusColors: Record<string, "green" | "orange" | "red" | "blue" | "gray"> = {
  APPROVED: "green",
  PENDING: "orange",
  REJECTED: "red",
  COMPLETED: "blue",
};

export default function ReturnPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [allReturns, setAllReturns] = useState<ReturnType[]>([]);
  const [pendingReturns, setPendingReturns] = useState<ReturnType[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);

  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [selectedReturnId, setSelectedReturnId] = useState<number | null>(null);

  const [approveForm, setApproveForm] = useState({ adminNotes: "", restockingFee: 0, notifyCustomer: true });
  const [rejectForm, setRejectForm] = useState({ rejectionReason: "", adminNotes: "", notifyCustomer: true });

  useEffect(() => {
    fetchAllReturns();
    fetchPendingReturns();
  }, []);

  const fetchAllReturns = async () => {
    setAllLoading(true);
    try {
      const res = await getAllReturns();
      if (res?.content) setAllReturns(res.content);
    } catch (err) {
      console.error("Error fetching all returns", err);
    } finally {
      setAllLoading(false);
    }
  };

  const fetchPendingReturns = async () => {
    setPendingLoading(true);
    try {
      const res = await getPendingReturns();
      if (res?.content) setPendingReturns(res.content);
    } catch (err) {
      console.error("Error fetching pending returns", err);
    } finally {
      setPendingLoading(false);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ReturnType>[]>(() => [
    {
      id: "actions",
      header: "Actions",
      size: 160,
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Approve">
            <span>
              <IconButton
                size="small"
                color="success"
                // disabled={row.original.status !== "PENDING"}
                onClick={() => { setSelectedReturnId(row.original.id); setApproveDialog(true); }}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reject">
            <span>
              <IconButton
                size="small"
                color="error"
                // disabled={row.original.status !== "PENDING"}
                onClick={() => { setSelectedReturnId(row.original.id); setRejectDialog(true); }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
    { accessorKey: "returnNumber", header: "Return Number", size: 160 },
    { accessorKey: "productName", header: "Product", size: 200 },
    {
      accessorKey: "status", header: "Status", size: 120,
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          size="small"
          sx={{
            background: statusColors[row.original.status] ?? "gray",
            color: "#fff",
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      ),
    },
    { accessorKey: "reason", header: "Reason", size: 140 },
    { accessorKey: "reasonDescription", header: "Description", size: 180 },
    { accessorKey: "quantity", header: "Qty", size: 120 },
    {
      accessorKey: "itemPrice", header: "Item Price", size: 110,
      Cell: ({ row }) => `₹${row.original.itemPrice}`,
    },
    {
      accessorKey: "refundAmount", header: "Refund Amount", size: 130,
      Cell: ({ row }) => `₹${row.original.refundAmount}`,
    },
    {
      accessorKey: "restockingFee", header: "Restocking Fee", size: 130,
      Cell: ({ row }) => `₹${row.original.restockingFee}`,
    },
    {
      accessorKey: "totalRefundAmount", header: "Total Refund", size: 120,
      Cell: ({ row }) => `₹${row.original.totalRefundAmount}`,
    },
    {
      accessorKey: "refundStatus", header: "Refund Status", size: 130,
      Cell: ({ row }) => row.original.refundStatus ?? "-",
    },
    { accessorKey: "orderId", header: "Order ID", size: 100 },
    { accessorKey: "userId", header: "User ID", size: 90 },
    {
      accessorKey: "createdAt", header: "Created At", size: 160,
      Cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: "approvedAt", header: "Approved At", size: 160,
      Cell: ({ row }) => row.original.approvedAt ? new Date(row.original.approvedAt).toLocaleString() : "-",
    },
    {
      accessorKey: "rejectedAt", header: "Rejected At", size: 160,
      Cell: ({ row }) => row.original.rejectedAt ? new Date(row.original.rejectedAt).toLocaleString() : "-",
    },
    {
      accessorKey: "completedAt", header: "Completed At", size: 160,
      Cell: ({ row }) => row.original.completedAt ? new Date(row.original.completedAt).toLocaleString() : "-",
    },
  ], []);

  const allTable = useMantineReactTable({
    columns,
    data: allReturns,
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    initialState: { density: "xs" },
    state: { isLoading: allLoading },
    mantineTableContainerProps: { sx: { maxHeight: "65vh" } },
  });

  const pendingTable = useMantineReactTable({
    columns,
    data: pendingReturns,
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    initialState: { density: "xs" },
    state: { isLoading: pendingLoading },
    mantineTableContainerProps: { sx: { maxHeight: "65vh" } },
  });

  const handleApprove = async () => {
    if (!selectedReturnId) return;
    try {
      await approveReturn(selectedReturnId, approveForm);
      setApproveDialog(false);
      setApproveForm({ adminNotes: "", restockingFee: 0, notifyCustomer: true });
      fetchAllReturns();
      fetchPendingReturns();
    } catch (err) {
      console.error("Error approving return", err);
    }
  };

  const handleReject = async () => {
    if (!selectedReturnId) return;
    try {
      await rejectReturn(selectedReturnId, rejectForm);
      setRejectDialog(false);
      setRejectForm({ rejectionReason: "", adminNotes: "", notifyCustomer: true });
      fetchAllReturns();
      fetchPendingReturns();
    } catch (err) {
      console.error("Error rejecting return", err);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AssignmentReturnIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Returns Management</Typography>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        sx={{ mb: 2, borderBottom: "1px solid #e2e8f0" }}
      >
        <Tab label={`All Returns (${allReturns.length})`} />
        <Tab label={`Pending Returns (${pendingReturns.length})`} />
      </Tabs>

      {/* All Returns */}
      {activeTab === 0 && (
        <Box sx={{ height: "75vh" }}>
          <MantineReactTable table={allTable} />
        </Box>
      )}

      {/* Pending Returns */}
      {activeTab === 1 && (
        <Box sx={{ height: "75vh" }}>
          <MantineReactTable table={pendingTable} />
        </Box>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialog} onClose={() => setApproveDialog(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Approve Return</DialogTitle>
          <IconButton onClick={() => setApproveDialog(false)} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Admin Notes"
              multiline rows={3} fullWidth size="small"
              value={approveForm.adminNotes}
              onChange={(e) => setApproveForm({ ...approveForm, adminNotes: e.target.value })}
            />
            <TextField
              label="Restocking Fee"
              type="number" fullWidth size="small"
              value={approveForm.restockingFee}
              onChange={(e) => setApproveForm({ ...approveForm, restockingFee: Number(e.target.value) })}
            />
            <FormControlLabel
              label="Notify Customer"
              control={
                <Checkbox
                  checked={approveForm.notifyCustomer}
                  onChange={(e) => setApproveForm({ ...approveForm, notifyCustomer: e.target.checked })}
                />
              }
            />
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined" onClick={() => setApproveDialog(false)}>Cancel</Button>
              <Button variant="contained" color="success" onClick={handleApprove}>Approve</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Reject Return</DialogTitle>
          <IconButton onClick={() => setRejectDialog(false)} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Rejection Reason"
              multiline rows={2} fullWidth size="small"
              value={rejectForm.rejectionReason}
              onChange={(e) => setRejectForm({ ...rejectForm, rejectionReason: e.target.value })}
            />
            <TextField
              label="Admin Notes"
              multiline rows={3} fullWidth size="small"
              value={rejectForm.adminNotes}
              onChange={(e) => setRejectForm({ ...rejectForm, adminNotes: e.target.value })}
            />
            <FormControlLabel
              label="Notify Customer"
              control={
                <Checkbox
                  checked={rejectForm.notifyCustomer}
                  onChange={(e) => setRejectForm({ ...rejectForm, notifyCustomer: e.target.checked })}
                />
              }
            />
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined" onClick={() => setRejectDialog(false)}>Cancel</Button>
              <Button variant="contained" color="error" onClick={handleReject}>Reject</Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}