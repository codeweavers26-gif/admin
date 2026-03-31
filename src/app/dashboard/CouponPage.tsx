"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Chip, CircularProgress, TextField, MenuItem, Button, Checkbox, FormControlLabel, Dialog, IconButton, DialogTitle, DialogContent, Tooltip, TableContainer, TableCell, TableBody, TableRow, Table, TableHead, Switch } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { bulkCreateCoupon, createCoupon, deleteCoupon, getCoupons, getCouponUsage, updateCoupon } from "@/src/services/authService/authService";
import { toQueryParams } from "@/src/utls/queryUtils";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Paper } from "@mui/material";

interface CouponType {
  id: number;
  code: string;
  description: string;
  type: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usagePerUser: number;
  status: string;
  totalUsedCount: number;
  applicableCategoryIds: number[];
  applicableProductIds: number[];
  excludedCategoryIds: number[];
  excludedProductIds: number[];
  isFirstOrderOnly: boolean;
  isNewUserOnly: boolean;
  applicablePaymentMethods: string[] | null;
  applicableUserTiers: string[] | null;
  createdAt: string;
  updatedAt: string;
}

const initialCoupon = {
  code: "", description: "", type: "PERCENTAGE", discountValue: 0,
  minOrderAmount: 0, maxDiscountAmount: 0,
  validFrom: "", validTo: "",
  usageLimit: 1, usagePerUser: 1,
  status: "ACTIVE", isFirstOrderOnly: false, isNewUserOnly: false,
  applicableCategoryIds: "", applicableProductIds: "",
  excludedCategoryIds: "", excludedProductIds: "",
  applicablePaymentMethods: "", applicableUserTiers: "",
}
interface CouponUsageType {
  id: number;
  couponCode: string;
  userEmail: string;
  orderNumber: string;
  discountAmount: number;
  usedAt: string;
  wasSuccessful: boolean;
}

const statusColors: Record<string, string> = {
  ACTIVE: "#22c55e",
  EXPIRED: "#94a3b8",
  DISABLED: "#ef4444",
  SCHEDULED: "#f59e0b",
};

const typeColors: Record<string, string> = {
  PERCENTAGE: "#667eea",
  FIXED: "#06b6d4",
  FREESHIPPING: "#10b981",
};

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Percentage", value: "PERCENTAGE" },
  { label: "Fixed", value: "FIXED" },
  { label: "Free Shipping", value: "FREESHIPPING" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Disabled", value: "DISABLED" },
  { label: "Scheduled", value: "SCHEDULED" },
];

export default function CouponPage() {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [totalElements, setTotalElements] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(initialCoupon);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);
  const isEditMode = selectedCouponId !== null;

  const [usageDialog, setUsageDialog] = useState(false);
  const [usageData, setUsageData] = useState<CouponUsageType[]>([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usagePagination, setUsagePagination] = useState({ page: 0, size: 10 });
  const [usageTotalElements, setUsageTotalElements] = useState(0);
  const [selectedCouponCode, setSelectedCouponCode] = useState(0);

  const [isBulk, setIsBulk] = useState(false);
  const [bulkCount, setBulkCount] = useState(1);
  const [bulkPrefix, setBulkPrefix] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const payload = {
        page: pagination.pageIndex,
        size: pagination.pageSize,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      }
      const res = await getCoupons(toQueryParams(payload));
      if (res?.content) {
        setCoupons(res.content);
        setTotalElements(res.totalElements);
      }
    } catch (err) {
      console.error("Error fetching coupons", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
    fetchCoupons();
  };

  const handleReset = () => {
    setTypeFilter("");
    setStatusFilter("");
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const handleOpenCreate = () => {
    setSelectedCouponId(null);
    setForm(initialCoupon);
    setDialogOpen(true);
  };

  const handleOpenEdit = (coupon: CouponType) => {
    setSelectedCouponId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      validFrom: coupon.validFrom ? coupon.validFrom.slice(0, 16) : "",
      validTo: coupon.validTo ? coupon.validTo.slice(0, 16) : "",
      usageLimit: coupon.usageLimit,
      usagePerUser: coupon.usagePerUser,
      status: coupon.status,
      isFirstOrderOnly: coupon.isFirstOrderOnly,
      isNewUserOnly: coupon.isNewUserOnly,
      applicableCategoryIds: coupon.applicableCategoryIds?.join(",") ?? "",
      applicableProductIds: coupon.applicableProductIds?.join(",") ?? "",
      excludedCategoryIds: coupon.excludedCategoryIds?.join(",") ?? "",
      excludedProductIds: coupon.excludedProductIds?.join(",") ?? "",
      applicablePaymentMethods: coupon.applicablePaymentMethods?.toString() ?? "",
      applicableUserTiers: coupon.applicableUserTiers?.toString() ?? "",
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCouponId(null);
    setForm(initialCoupon);
    setIsBulk(false);
    setBulkCount(1);
    setBulkPrefix("");
  };

  const buildPayload = (f: typeof initialCoupon) => ({
    ...f,
    discountValue: Number(f.discountValue),
    minOrderAmount: Number(f.minOrderAmount),
    maxDiscountAmount: Number(f.maxDiscountAmount),
    usageLimit: Number(f.usageLimit),
    usagePerUser: Number(f.usagePerUser),
    applicableCategoryIds: f.applicableCategoryIds
      ? String(f.applicableCategoryIds).split(",").map(Number) : [],
    applicableProductIds: f.applicableProductIds
      ? String(f.applicableProductIds).split(",").map(Number) : [],
    excludedCategoryIds: f.excludedCategoryIds
      ? String(f.excludedCategoryIds).split(",").map(Number) : [],
    excludedProductIds: f.excludedProductIds
      ? String(f.excludedProductIds).split(",").map(Number) : [],
  });

  const handleSubmit = async () => {
    try {
      const payload = buildPayload(form);
      if (isEditMode) {
        await updateCoupon(selectedCouponId!, payload);
        alert("Coupon Updated Successfully");
      } else if (isBulk) {
        await bulkCreateCoupon({ count: bulkCount, prefix: bulkPrefix, template: payload });
        alert(`${bulkCount} Coupons Created Successfully`);
      } else {
        await createCoupon(payload);
        alert("Coupon Created Successfully");
      }
      handleCloseDialog();
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon", err);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      alert("Coupon Deleted Successfully");
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon", err);
    }
  };

  const fetchCouponUsage = async (code: number, page = 0, size = 10) => {
    setUsageLoading(true);
    try {
      const payload = {
        page: page,
        size: size,
      };
      const res = await getCouponUsage(code, toQueryParams(payload));
      if (res?.content) {
        setUsageData(res.content);
        setUsageTotalElements(res.totalElements);
      }
    } catch (err) {
      console.error("Error fetching coupon usage", err);
    } finally {
      setUsageLoading(false);
    }
  };

  const handleOpenUsage = (coupon: CouponType) => {
    setSelectedCouponCode(coupon.id);
    setUsagePagination({ page: 0, size: 10 });
    fetchCouponUsage(coupon.id);
    setUsageDialog(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocalOfferIcon color="primary" />
          <Typography variant="h5" fontWeight={600}>Coupon Management</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
            boxShadow: "0 3px 5px 2px rgba(102, 126, 234, .3)",
          }}
        >
          Add Coupon
        </Button>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap" alignItems="center">
        <TextField
          select size="small" label="Type" value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {TYPE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>

        <TextField
          select size="small" label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {STATUS_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
          ))}
        </TextField>

        <Button variant="contained" className="app-btn-sm" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" className="app-btn-sm" onClick={handleReset}>
          Reset
        </Button>
      </Box>

      {/* Cards Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : coupons.length === 0 ? (
        <Typography color="text.secondary">No coupons found.</Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 2 }}>
          {coupons.map((coupon) => (
            <Box
              key={coupon.id}
              sx={{
                background: "#fff",
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                overflow: "hidden",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.1)" },
              }}
            >
              {/* Card Header */}
              <Box
                sx={{
                  background: typeColors[coupon.type] ?? "#667eea",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography fontWeight={800} fontSize={20} color="#fff" letterSpacing={2}>
                    {coupon.code}
                  </Typography>
                  <Typography fontSize={12} color="rgba(255,255,255,0.8)" mt={0.5}>
                    {coupon.description}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                  <Chip
                    label={coupon.status}
                    size="small"
                    sx={{ background: statusColors[coupon.status] ?? "#94a3b8", color: "#fff", fontWeight: 600, fontSize: 11 }}
                  />
                  <Chip
                    label={coupon.type}
                    size="small"
                    sx={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 600, fontSize: 11 }}
                  />
                </Box>
              </Box>

              {/* Discount Banner */}
              <Box sx={{ background: "#f8fafc", px: 2, py: 1, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight={700} fontSize={18} color="primary">
                  {coupon.type === "PERCENTAGE"
                    ? `${coupon.discountValue}% OFF`
                    : coupon.type === "FREESHIPPING"
                      ? "FREE SHIPPING"
                      : `₹${coupon.discountValue} OFF`}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  Max: ₹{coupon.maxDiscountAmount}
                </Typography>
              </Box>

              {/* Card Body */}
              <Box p={2} display="flex" flexDirection="column" gap={1.5}>

                {/* Order & Usage */}
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontSize={11} color="text.secondary">Min Order</Typography>
                    <Typography fontWeight={600} fontSize={13}>₹{coupon.minOrderAmount}</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography fontSize={11} color="text.secondary">Usage Limit</Typography>
                    <Typography fontWeight={600} fontSize={13}>{coupon.usageLimit}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography fontSize={11} color="text.secondary">Used / Per User</Typography>
                    <Typography fontWeight={600} fontSize={13}>{coupon.totalUsedCount} / {coupon.usagePerUser}</Typography>
                  </Box>
                </Box>

                {/* Validity */}
                <Box sx={{ borderTop: "1px solid #f1f5f9", pt: 1 }}>
                  <Typography fontSize={11} color="text.secondary" mb={0.5}>Validity</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography fontSize={12}>From: {new Date(coupon.validFrom).toLocaleDateString()}</Typography>
                    <Typography fontSize={12}>To: {new Date(coupon.validTo).toLocaleDateString()}</Typography>
                  </Box>
                </Box>

                {/* Tags */}
                <Box display="flex" gap={1} flexWrap="wrap">
                  {coupon.isFirstOrderOnly && (
                    <Chip label="First Order Only" size="small" color="warning" sx={{ fontSize: 10 }} />
                  )}
                  {coupon.isNewUserOnly && (
                    <Chip label="New User Only" size="small" color="info" sx={{ fontSize: 10 }} />
                  )}
                  {coupon.applicableCategoryIds?.length > 0 && (
                    <Chip label={`${coupon.applicableCategoryIds.length} Categories`} size="small" sx={{ fontSize: 10 }} />
                  )}
                  {coupon.applicableProductIds?.length > 0 && (
                    <Chip label={`${coupon.applicableProductIds.length} Products`} size="small" sx={{ fontSize: 10 }} />
                  )}
                </Box>
                <Box display="flex" justifyContent="flex-end" gap={1} pt={1} sx={{ borderTop: "1px solid #f1f5f9" }}>
                  <Tooltip title="View Usage">
                    <IconButton size="small" color="info" onClick={() => handleOpenUsage(coupon)}>
                      <BarChartIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Coupon">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEdit(coupon)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Coupon">
                    <IconButton size="small" color="error" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={3}>
        <Button
          variant="outlined" size="small"
          disabled={pagination.pageIndex === 0}
          onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 }))}
        >
          Previous
        </Button>
        <Typography fontSize={13}>
          Page {pagination.pageIndex + 1} of {Math.ceil(totalElements / pagination.pageSize) || 1}
        </Typography>
        <Button
          variant="outlined" size="small"
          disabled={(pagination.pageIndex + 1) * pagination.pageSize >= totalElements}
          onClick={() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 }))}
        >
          Next
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={-3}>
          <DialogTitle>
            {isEditMode ? "Edit Coupon" : isBulk ? "Bulk Create Coupons" : "Create Coupon"}
          </DialogTitle>
          <Box display="flex" alignItems="center" gap={1} ml={-55}>
            {!isEditMode && (
              <FormControlLabel
                label={<Typography fontSize={15} fontWeight={500}>Bulk Create</Typography>}
                control={
                  <Switch
                    checked={isBulk}
                    onChange={(e) => setIsBulk(e.target.checked)}
                    size="small"
                  />
                }
              />
            )}
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
            {isBulk && (
              <>
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary"
                    sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    Bulk Settings
                  </Typography>
                </Box>
                <TextField
                  label="Count" size="small" type="number" fullWidth
                  value={bulkCount}
                  onChange={(e) => setBulkCount(Math.max(1, Number(e.target.value)))}
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Prefix" size="small" fullWidth
                  value={bulkPrefix}
                  onChange={(e) => setBulkPrefix(e.target.value.toUpperCase())}
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
                <Box sx={{ gridColumn: "1 / -1", borderBottom: "1px solid #e2e8f0" }} />
              </>
            )}
            <TextField
              label="Code" size="small" fullWidth
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
            <TextField
              label="Description" size="small" fullWidth
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              select label="Type" size="small" fullWidth
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPE_OPTIONS.filter(o => o.value).map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              select label="Status" size="small" fullWidth
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.filter(o => o.value).map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Discount Value" size="small" type="number" fullWidth
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
            />
            <TextField
              label="Min Order Amount" size="small" type="number" fullWidth
              value={form.minOrderAmount}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
            />
            <TextField
              label="Max Discount Amount" size="small" type="number" fullWidth
              value={form.maxDiscountAmount}
              onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })}
            />
            <TextField
              label="Usage Limit" size="small" type="number" fullWidth
              value={form.usageLimit}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
            />
            <TextField
              label="Usage Per User" size="small" type="number" fullWidth
              value={form.usagePerUser}
              onChange={(e) => setForm({ ...form, usagePerUser: Number(e.target.value) })}
            />
            <TextField
              label="Valid From" size="small" type="datetime-local" fullWidth
              value={form.validFrom}
              onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Valid To" size="small" type="datetime-local" fullWidth
              value={form.validTo}
              onChange={(e) => setForm({ ...form, validTo: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Applicable Category IDs (comma separated)" size="small" fullWidth
              value={form.applicableCategoryIds}
              onChange={(e) => setForm({ ...form, applicableCategoryIds: e.target.value })}
            />
            <TextField
              label="Applicable Product IDs (comma separated)" size="small" fullWidth
              value={form.applicableProductIds}
              onChange={(e) => setForm({ ...form, applicableProductIds: e.target.value })}
            />
            <TextField
              label="Excluded Category IDs (comma separated)" size="small" fullWidth
              value={form.excludedCategoryIds}
              onChange={(e) => setForm({ ...form, excludedCategoryIds: e.target.value })}
            />
            <TextField
              label="Excluded Product IDs (comma separated)" size="small" fullWidth
              value={form.excludedProductIds}
              onChange={(e) => setForm({ ...form, excludedProductIds: e.target.value })}
            />
            <TextField
              label="Applicable Payment Methods" size="small" fullWidth
              value={form.applicablePaymentMethods}
              onChange={(e) => setForm({ ...form, applicablePaymentMethods: e.target.value })}
            />
            <TextField
              label="Applicable User Tiers" size="small" fullWidth
              value={form.applicableUserTiers}
              onChange={(e) => setForm({ ...form, applicableUserTiers: e.target.value })}
            />
            <Box display="flex" gap={3} sx={{ gridColumn: "1 / -1" }}>
              <FormControlLabel
                label="First Order Only"
                control={
                  <Checkbox
                    checked={form.isFirstOrderOnly}
                    onChange={(e) => setForm({ ...form, isFirstOrderOnly: e.target.checked })}
                  />
                }
              />
              <FormControlLabel
                label="New User Only"
                control={
                  <Checkbox
                    checked={form.isNewUserOnly}
                    onChange={(e) => setForm({ ...form, isNewUserOnly: e.target.checked })}
                  />
                }
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ gridColumn: "1 / -1" }}>
              <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit}>
                {isEditMode ? "Update Coupon" : isBulk ? `Create ${bulkCount} Coupons` : "Create Coupon"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={usageDialog}
        onClose={() => setUsageDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <DialogTitle>
            Usage History · <strong>{selectedCouponCode}</strong>
          </DialogTitle>
          <IconButton onClick={() => setUsageDialog(false)} sx={{ mr: 4, "&:hover": { color: "error.main" } }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent>
          {usageLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : usageData.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No usage records found for this coupon.
            </Typography>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>User Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Order Number</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Discount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Used At</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usageData.map((u) => (
                      <TableRow key={u.id} hover>
                        <TableCell>{u.id}</TableCell>
                        <TableCell>{u.userEmail}</TableCell>
                        <TableCell>{u.orderNumber}</TableCell>
                        <TableCell>₹{u.discountAmount}</TableCell>
                        <TableCell>
                          {new Date(u.usedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={u.wasSuccessful ? "Success" : "Failed"}
                            size="small"
                            color={u.wasSuccessful ? "success" : "error"}
                            sx={{ fontSize: 11 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
                <Button
                  variant="outlined" size="small"
                  disabled={usagePagination.page === 0}
                  onClick={() => {
                    const newPage = usagePagination.page - 1;
                    setUsagePagination((p) => ({ ...p, page: newPage }));
                    fetchCouponUsage(selectedCouponCode, newPage, usagePagination.size);
                  }}
                >
                  Previous
                </Button>
                <Typography fontSize={13}>
                  Page {usagePagination.page + 1} of {Math.ceil(usageTotalElements / usagePagination.size) || 1}
                </Typography>
                <Button
                  variant="outlined" size="small"
                  disabled={(usagePagination.page + 1) * usagePagination.size >= usageTotalElements}
                  onClick={() => {
                    const newPage = usagePagination.page + 1;
                    setUsagePagination((p) => ({ ...p, page: newPage }));
                    fetchCouponUsage(selectedCouponCode, newPage, usagePagination.size);
                  }}
                >
                  Next
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}