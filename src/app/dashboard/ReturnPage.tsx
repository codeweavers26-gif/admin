"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box, Typography, Chip, Tabs, Tab, Tooltip, IconButton,
  Dialog, DialogContent, DialogTitle, Checkbox, FormControlLabel,
  Button, TextField,
} from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import { MantineReactTable, MRT_ColumnDef, useMantineReactTable } from "mantine-react-table";
import {
  approveReturn,
  getAllReturns,
  getPendingReturns,
  rejectReturn,
  updateReturnStatus,
} from "@/src/services/authService/authService";

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

const RETURN_STATUSES = [
  { value: "PENDING_APPROVAL",  label: "Pending Approval",  color: "#f59e0b" },
  { value: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  color: "#3b82f6" },
  { value: "PICKUP_COMPLETED",  label: "Pickup Completed",  color: "#6366f1" },
  { value: "QC_PENDING",        label: "QC Pending",        color: "#8b5cf6" },
  { value: "QC_IN_PROGRESS",    label: "QC In Progress",    color: "#a855f7" },
  { value: "QC_PASSED",         label: "QC Passed",         color: "#10b981" },
  { value: "QC_FAILED",         label: "QC Failed",         color: "#ef4444" },
  { value: "REFUND_PENDING",    label: "Refund Pending",    color: "#f97316" },
  { value: "REFUND_COMPLETED",  label: "Refund Completed",  color: "#22c55e" },
  { value: "COMPLETED",         label: "Completed",         color: "#14b8a6" },
  { value: "REJECTED",          label: "Rejected",          color: "#dc2626" },
  { value: "CANCELLED",         label: "Cancelled",         color: "#6b7280" },
];

const statusMeta: Record<string, { label: string; color: string }> = Object.fromEntries(
  RETURN_STATUSES.map((s) => [s.value, s])
);

/* ── inline status selector ───────────────────────────────────────────── */
function StatusSelect({
  returnId,
  currentStatus,
  onUpdated,
}: {
  returnId: number;
  currentStatus: string;
  onUpdated: () => void;
}) {
  const [value, setValue] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === value) return;
    setSaving(true);
    setValue(newStatus);
    try {
      await updateReturnStatus(returnId, { status: newStatus, notifyCustomer: true });
      onUpdated();
    } catch {
      setValue(currentStatus); // revert on error
    } finally {
      setSaving(false);
    }
  };

  const meta = statusMeta[value];

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => { void handleChange(e.target.value); }}
      style={{
        padding: "3px 6px",
        borderRadius: 6,
        border: `1.5px solid ${meta?.color ?? "#9ca3af"}`,
        background: "#fff",
        color: meta?.color ?? "#374151",
        fontWeight: 600,
        fontSize: 11,
        cursor: saving ? "wait" : "pointer",
        outline: "none",
        minWidth: 140,
      }}
    >
      {RETURN_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

export default function ReturnPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [allReturns, setAllReturns]       = useState<ReturnType[]>([]);
  const [pendingReturns, setPendingReturns] = useState<ReturnType[]>([]);
  const [allLoading, setAllLoading]         = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);

  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog,  setRejectDialog]  = useState(false);
  const [selectedReturnId, setSelectedReturnId] = useState<number | null>(null);

  const [approveForm, setApproveForm] = useState({ adminNotes: "", restockingFee: 0, notifyCustomer: true });
  const [rejectForm,  setRejectForm]  = useState({ rejectionReason: "", adminNotes: "", notifyCustomer: true });

  const [actionError,   setActionError]   = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

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
      if (Array.isArray(res))   setPendingReturns(res);
      else if (res?.content)    setPendingReturns(res.content);
    } catch (err) {
      console.error("Error fetching pending returns", err);
    } finally {
      setPendingLoading(false);
    }
  };

  const refresh = useCallback(() => {
    fetchAllReturns();
    fetchPendingReturns();
  }, []);

  /* ── columns ─────────────────────────────────────────────────────────── */
  const columns = useMemo<MRT_ColumnDef<ReturnType>[]>(() => [
    {
      id: "actions",
      header: "Actions",
      size: 110,
      Cell: ({ row }) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="Approve (schedule pickup)">
            <span>
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  setSelectedReturnId(row.original.id);
                  setActionError(null);
                  setApproveDialog(true);
                }}
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
                onClick={() => {
                  setSelectedReturnId(row.original.id);
                  setActionError(null);
                  setRejectDialog(true);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
    { accessorKey: "returnNumber", header: "Return #",   size: 150 },
    { accessorKey: "orderId",      header: "Order ID",   size: 90  },
    { accessorKey: "userId",       header: "User ID",    size: 80  },
    {
      accessorKey: "status",
      header: "Status",
      size: 180,
      Cell: ({ row }) => (
        <StatusSelect
          returnId={row.original.id}
          currentStatus={row.original.status}
          onUpdated={refresh}
        />
      ),
    },
    { accessorKey: "reason",              header: "Reason",      size: 140 },
    { accessorKey: "reasonDescription",   header: "Description", size: 180 },
    { accessorKey: "quantity",            header: "Qty",         size: 70  },
    {
      accessorKey: "refundAmount",
      header: "Refund",
      size: 110,
      Cell: ({ row }) => `₹${row.original.refundAmount ?? 0}`,
    },
    {
      accessorKey: "totalRefundAmount",
      header: "Total Refund",
      size: 120,
      Cell: ({ row }) => `₹${row.original.totalRefundAmount ?? 0}`,
    },
    {
      accessorKey: "refundStatus",
      header: "Refund Status",
      size: 120,
      Cell: ({ row }) => row.original.refundStatus ?? "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 130,
      Cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        }),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [refresh]);

  const tableConfig = {
    enableStickyHeader: true,
    enableColumnOrdering: true,
    enableColumnResizing: true,
    enableColumnPinning: true,
    enableRowVirtualization: true,
    initialState: { density: "xs" as const },
    mantineTableContainerProps: { sx: { maxHeight: "65vh" } },
  };

  const allTable     = useMantineReactTable({ ...tableConfig, columns, data: allReturns,     state: { isLoading: allLoading     } });
  const pendingTable = useMantineReactTable({ ...tableConfig, columns, data: pendingReturns, state: { isLoading: pendingLoading } });

  /* ── handlers ────────────────────────────────────────────────────────── */
  const handleApprove = async () => {
    if (!selectedReturnId) return;
    setActionLoading(true); setActionError(null);
    try {
      await approveReturn(selectedReturnId, approveForm);
      setApproveDialog(false);
      setApproveForm({ adminNotes: "", restockingFee: 0, notifyCustomer: true });
      refresh();
    } catch (err: any) {
      setActionError(err?.message ?? "Failed to approve return");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReturnId) return;
    setActionLoading(true); setActionError(null);
    try {
      await rejectReturn(selectedReturnId, rejectForm);
      setRejectDialog(false);
      setRejectForm({ rejectionReason: "", adminNotes: "", notifyCustomer: true });
      refresh();
    } catch (err: any) {
      setActionError(err?.message ?? "Failed to reject return");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── render ──────────────────────────────────────────────────────────── */
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <AssignmentReturnIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>Returns Management</Typography>
      </Box>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Tab label={`All Returns (${allReturns.length})`} />
        <Tab label={`Pending Approval (${pendingReturns.length})`} />
      </Tabs>

      {activeTab === 0 && <Box sx={{ height: "75vh" }}><MantineReactTable table={allTable} /></Box>}
      {activeTab === 1 && <Box sx={{ height: "75vh" }}><MantineReactTable table={pendingTable} /></Box>}

      {/* ── Approve Dialog ──────────────────────────────────────────────── */}
      <Dialog open={approveDialog} onClose={() => setApproveDialog(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Approve Return</DialogTitle>
          <IconButton onClick={() => setApproveDialog(false)} sx={{ mr: 4 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <Typography variant="caption" color="text.secondary">
              Approving will schedule a courier pickup automatically via Shiprocket.
            </Typography>
            <TextField label="Admin Notes" multiline rows={3} fullWidth size="small"
              value={approveForm.adminNotes}
              onChange={(e) => setApproveForm({ ...approveForm, adminNotes: e.target.value })} />
            <TextField label="Restocking Fee" type="number" fullWidth size="small"
              value={approveForm.restockingFee}
              onChange={(e) => setApproveForm({ ...approveForm, restockingFee: Number(e.target.value) })} />
            <FormControlLabel label="Notify Customer via Email"
              control={<Checkbox checked={approveForm.notifyCustomer}
                onChange={(e) => setApproveForm({ ...approveForm, notifyCustomer: e.target.checked })} />} />
            {actionError && <Typography variant="caption" color="error">{actionError}</Typography>}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined"  onClick={() => setApproveDialog(false)} disabled={actionLoading}>Cancel</Button>
              <Button variant="contained" color="success" onClick={handleApprove}  disabled={actionLoading}>
                {actionLoading ? "Approving…" : "Approve"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── Reject Dialog ───────────────────────────────────────────────── */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="sm" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>Reject Return</DialogTitle>
          <IconButton onClick={() => setRejectDialog(false)} sx={{ mr: 4 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Rejection Reason *" multiline rows={2} fullWidth size="small"
              value={rejectForm.rejectionReason}
              onChange={(e) => setRejectForm({ ...rejectForm, rejectionReason: e.target.value })} />
            <TextField label="Admin Notes" multiline rows={3} fullWidth size="small"
              value={rejectForm.adminNotes}
              onChange={(e) => setRejectForm({ ...rejectForm, adminNotes: e.target.value })} />
            <FormControlLabel label="Notify Customer via Email"
              control={<Checkbox checked={rejectForm.notifyCustomer}
                onChange={(e) => setRejectForm({ ...rejectForm, notifyCustomer: e.target.checked })} />} />
            {actionError && <Typography variant="caption" color="error">{actionError}</Typography>}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
              <Button variant="outlined" onClick={() => setRejectDialog(false)} disabled={actionLoading}>Cancel</Button>
              <Button variant="contained" color="error" onClick={handleReject}
                disabled={actionLoading || !rejectForm.rejectionReason.trim()}>
                {actionLoading ? "Rejecting…" : "Reject"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
