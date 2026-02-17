import { getCustomerSummary, getDashboardMetrics, getOrderStatusSummary, getOrderSummary, getRevenueSummay } from "@/src/services/authService/authService";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
} from "@mui/material";

export default function DashboardPage() {

  const [revenueData, setRevenueData] = useState({
    todayRevenue: 0,
    thisMonthRevenue: 0,
    taxCollectedMonth: 0,
    codOrders: 0,
    prepaidOrders: 0
  });

  const [orders, setOrders] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [orderStatus, setOrderStatus] = useState({
    pending: 0,
    shipped: 0,
    cancelled: 0,
    delivered: 0
  });


  const [customer, setCustomer] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [dashboardStats, setDashboardStats] = useState({
    total_cart_value: 0,
    total_inventory_left: 0,
    total_items_sold: 0,
    total_orders: 0,
    total_sales: 0,
    total_users: 0,
    users_with_cart: 0
  });

  useEffect(() => {
    getDashboardData();
  }, [])
  const getDashboardData = async () => {
    try {
      const dashRes = await getDashboardMetrics();
      if (dashRes) {
        setDashboardStats(dashRes)
      }
      const revRes = await getRevenueSummay();
      if (revRes) {
        setRevenueData(revRes)
      }
      const orderRes = await getOrderSummary();
      if (orderRes) {
        setOrders(orderRes)
      }
      const orderStatusRes = await getOrderStatusSummary();
      if (orderStatusRes) {
        setOrderStatus(orderStatusRes)
      }
      const custRes = await getCustomerSummary();
      if (custRes) {
        setCustomer(custRes);
      }
    }
    catch {
      console.error("Error getting Products");
    }
  }

  const StatCard = ({
    title,
    value,
    icon,
    gradient = ["#667eea", "#764ba2"], // default gradient purple-blue
  }: {
    title: string;
    value: number;
    icon?: React.ReactNode;
    gradient?: string[];
  }) => {
    return (
      <Card
        elevation={6}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          color: "white",
          minHeight: 130,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          },
        }}
      >
        {/* Text */}
        <Box>
          <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </Box>

        {/* Icon */}
        {icon && (
          <Box
            sx={{
              fontSize: 50,
              opacity: 0.2,
              position: "absolute",
              right: 16,
              bottom: 16,
            }}
          >
            {icon}
          </Box>
        )}
      </Card>
    );
  };

  return (
    <Box p={3}>

      <Typography variant="h6" gutterBottom>
        Revenue Summary
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(4,1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard title="Today's Revenue" value={revenueData.todayRevenue} />
        <StatCard title="This Month Revenue" value={revenueData.thisMonthRevenue} />
        <StatCard title="Tax Collected (Month)" value={revenueData.taxCollectedMonth} />
        <StatCard title="COD Orders" value={revenueData.codOrders} />
        <StatCard title="Prepaid Orders" value={revenueData.prepaidOrders} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Orders Summary
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(5,1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard title="Today" value={orders.today} />
        <StatCard title="This Week" value={orders.thisMonth} />
        <StatCard title="This Month" value={orders.thisWeek} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Order Status Summary
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard title="Pending" value={orderStatus.pending} />
        <StatCard title="Shipped" value={orderStatus.shipped} />
        <StatCard title="Delivered" value={orderStatus.cancelled} />
        <StatCard title="Cancelled" value={orderStatus.delivered} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Customer Summary
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(4,1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard title="Today" value={customer.today} />
        <StatCard title="This Week" value={customer.thisWeek} />
        <StatCard title="This Month" value={customer.thisMonth} />
      </Box>

      <Typography variant="h6" gutterBottom>
        Dashboard Stats Summary
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
          gap: 2,
        }}
      >
        <StatCard title="Total Cart Value" value={dashboardStats.total_cart_value} />
        <StatCard title="Total Inventory left" value={dashboardStats.total_inventory_left} />
        <StatCard title="Total Items Sold" value={dashboardStats.total_items_sold} />
        <StatCard title="Total Orders" value={dashboardStats.total_orders} />
        <StatCard title="Total Sales" value={dashboardStats.total_sales} />
        <StatCard title="Total Users" value={dashboardStats.total_users} />
        <StatCard title="User With Cart" value={dashboardStats.users_with_cart} />
      </Box>

    </Box>
  );
}