"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField, Chip, Stack, Typography, } from "@mui/material";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable, } from "mantine-react-table";
import { getAllReturns, updateReturnStatus } from "@/src/services/authService/authService";

interface ReturnType {
  orderId: number;
  productName: string;
  quantity: number;
  reason: string;
  refundAmount: number;
  requestedAt: string;
  returnId: number;
  status: string;
  userEmail: string;
  userId: number;
}

export default function ReturnPage() {
  const [returns, setReturns] = useState<ReturnType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedReturn, setSelectedReturn] = useState<ReturnType | null>(null);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [adminComment, setAdminComment] = useState("");

  const columns = useMemo<MRT_ColumnDef<ReturnType>[]>(() => [
    { accessorKey: "returnId", header: "Return ID" },
    { accessorKey: "orderId", header: "Order ID" },
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "userEmail", header: "User Email" },
    { accessorKey: "quantity", header: "Qty" },
    { accessorKey: "reason", header: "Reason" },
    {
      accessorKey: "refundAmount",
      header: "Refund",
      Cell: ({ row }) => `₹${row.original.refundAmount}`,
    },
    {
      accessorKey: "requestedAt",
      header: "Requested At",
      Cell: ({ row }) =>
        new Date(row.original.requestedAt).toLocaleString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={
            row.original.status === "APPROVED"
              ? "success"
              : row.original.status === "REJECTED"
                ? "error"
                : row.original.status === "PENDING"
                  ? "warning"
                  : "default"
          }
          size="small"
        />
      ),
    },
    {
      id: "actions",
      header: "",
      Cell: ({ row }) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOpenStatusModal(row.original)}
        >
          Update Status
        </Button>
      ),
    },
  ], []);

  const table = useMantineReactTable({
    columns,
    data: returns,
    manualPagination: true,
    enableStickyHeader: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    initialState: { density: "xs" },
  });

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await getAllReturns();
      if (res?.content) {
        setReturns(res.content);
      }
    } catch (error) {
      console.error("Error fetching returns", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (ret: ReturnType) => {
    setSelectedReturn(ret);
    setNewStatus(ret.status);
    setRefundAmount(ret.refundAmount);
    setAdminComment("");
    setOpenStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReturn) return;

    try {
      await updateReturnStatus(selectedReturn.returnId, {
        status: newStatus,
        refundAmount: refundAmount,
        adminComment: adminComment,
      });

      setOpenStatusModal(false);
      fetchReturns();
    } catch (error) {
      console.error("Error updating return:", error);
    }
  };


  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Return Management
      </Typography>

      <Box sx={{ height: "75vh" }}>
        <MantineReactTable table={table} />
      </Box>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Return</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>

            <TextField
              label="Return ID"
              value={selectedReturn?.returnId || ""}
              disabled
              fullWidth
              size="small"
            />

            <TextField
              select
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
              <MenuItem value="REFUNDED">Refunded</MenuItem>
            </TextField>

            <TextField
              label="Refund Amount"
              type="text"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              fullWidth
              size="small"
            />

            <TextField
              label="Admin Comment"
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
            />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateStatus}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
