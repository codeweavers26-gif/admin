"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addProduct, adminlogout, getCustomerSummary, getDashboardMetrics, getLocations, getOrders, getOrderStatusSummary, getOrderSummary, getProduct, getRevenueSummay } from "../../services/authService/authService";
import { useState } from "react";
import UserPage from "./userPage";
import OrdersPage from "./OrdersPage";
import LocationPage from "./LocationPage";
import DashboardPage from "./DashboadPage";
import CatalogMainPage from "./CatalogMainPage";
import ProductPage from "./ProductPage";
import InventoryPage from "./InventoryPage";


interface Product {
  name: string;
  brand: string;
  sku: string;
  slug: string;
  description: string;
  mrp: string;
  price: string;
  stock: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  returnable: boolean;
  images: string[];
  short_description: string;
  discount_percent: string;
  tax_percent: string;
  cod_available: boolean;
  delivery_days: string;
}

const initalProduct: Product = {
  name: "",
  brand: "",
  sku: "",
  slug: "",
  description: "",
  mrp: "",
  price: "",
  stock: "",
  weight: "",
  length: "",
  width: "",
  height: "",
  returnable: true,
  images: [],
  short_description: "",
  discount_percent: "",
  tax_percent: "",
  cod_available: true,
  delivery_days: "",
}
// const columns: GridColDef[] = [
//   { field: "name", headerName: "Name", width: 160 },
//   { field: "brand", headerName: "Brand", width: 160 },
//   { field: "sku", headerName: "SKU", width: 160 },
//   { field: "slug", headerName: "Slug", width: 160 },
//   { field: "description", headerName: "Description", width: 160, renderCell: (params) => (params.value ? "Yes" : "No") },
//   { field: "mrp", headerName: "MRP", width: 160 },
//   { field: "price", headerName: "Price", width: 160 },
//   { field: "stock", headerName: "Stock", width: 160 },
//   { field: "weight", headerName: "Weight", width: 160 },
//   { field: "length", headerName: "Length", width: 160 },
//   { field: "width", headerName: "Width", width: 160 },
//   { field: "height", headerName: "Height", width: 160 },
//   { field: "returnable", headerName: "Returnable", width: 160, renderCell: (params) => (params.value ? "Yes" : "No") },
//   { field: "short_description", headerName: "Short Description", width: 160 },
//   { field: "discount_percent", headerName: "Discount Percent", width: 160 },
//   { field: "tax_percent", headerName: "Tax Percent", width: 160 },
//   { field: "cod_available", headerName: "COD Available", width: 160, renderCell: (params) => (params.value ? "Yes" : "No") },
//   { field: "delivery_days", headerName: "Delivery Days", width: 160 },
// ];

interface RevenueData {
  todayRevenue: number;
  thisMonthRevenue: number;
  taxCollectedMonth: number;
  codOrders: number;
  prepaidOrders: number;
}

interface OrdersSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface OrderStatusSummary {
  pending: number;
  shipped: number;
  cancelled: number;
  delivered: number;
}

interface CustomerSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface DashboardStatsData {
  total_cart_value: number;
  total_inventory_left: number;
  total_items_sold: number;
  total_orders: number;
  total_sales: number;
  total_users: number;
  users_with_cart: number;
}

interface DashboardStatsProps {
  revenueData: RevenueData;
  orders: OrdersSummary;
  dashboardStats: DashboardStatsData;
  customer: CustomerSummary;
  orderStatus: OrderStatusSummary;
}


interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'products' | 'orders' | 'locations' | 'catalog' | 'inventory' | 'content'>('dashboard');

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [locationsList, setLocationsList] = useState<any[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, [])


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

  const handleLogout = async () => {
    try {
      await adminlogout({ message: "logout" });
    } catch { }
    finally {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      router.push("/auth/login");
    }
  };

  const getData = async () => {
    setProductLoading(true);
    try {
      const res = await getProduct();

      if (res) {
        setProducts(res)
      }
    } catch {
      console.error("Error getting Products");
    } finally {
      setProductLoading(false);
    }
  };

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

  const getOrdersData = async () => {
    setOrdersLoading(true);
    try {
      const res = await getOrders('0', '100');
      if (res) {
        setOrdersList(res.content || []);
      }
    } catch (error) {
      console.error("Error getting Orders", error);
      setOrdersList([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  const getLocationsData = async () => {
    setLocationsLoading(true);
    try {
      const res = await getLocations();
      if (res) {
        setLocationsList(res || []);
      }
    } catch (error) {
      console.error("Error getting Locations", error);
      setLocationsList([]);
    } finally {
      setLocationsLoading(false);
    }
  };


  // const showDashboard = () => { setActiveView('dashboard'); getDashboardData(); };
  const showDashboard = () => { setActiveView('dashboard'); };
  const showProducts = () => { setActiveView('products'); getData(); };
  const showOrders = () => { setActiveView('orders'); };
  const showLocations = () => { setActiveView('locations'); getLocationsData(); };
  const showUsers = () => { setActiveView('users'); };
  const showCatalog = () => { setActiveView('catalog'); };
  const showInventory = () => { setActiveView('inventory'); };

  return (
    <div style={appContainer}>
      {/* MAIN LAYOUT */}
      <div style={mainLayout}>
        {/* LEFT SIDEBAR */}
        <aside style={sidebarStyle}>
          <div>
            <div style={sidebarHeader}>
              <h3 style={sidebarTitle}>Menu</h3>
            </div>

            <nav style={navStyle}>
              <SidebarItem
                label="Dashboard"
                icon="📊"
                isActive={activeView === 'dashboard'}
                onClick={showDashboard}
              />
              <SidebarItem
                label="Users"
                icon="📋"
                isActive={activeView === 'users'}
                onClick={showUsers}
              />
              <SidebarItem
                label="Products"
                icon="📋"
                isActive={activeView === 'products'}
                onClick={showProducts}
              />
              <SidebarItem
                label="Orders"
                icon="📦"
                isActive={activeView === 'orders'}
                onClick={showOrders}
              />
              <SidebarItem
                label="Locations"
                icon="📍"
                isActive={activeView === 'locations'}
                onClick={showLocations}
              />
              <SidebarItem
                label="Catalog"
                icon="📚"
                isActive={activeView === 'catalog'}
                onClick={showCatalog}
              />
              <SidebarItem
                label="Inventory"
                icon="📋"
                isActive={activeView === 'inventory'}
                onClick={showInventory}
              />
            </nav>
          </div>
          <div style={logoutContainer}>
            <SidebarItem
              label="Logout"
              icon="🚪"
              onClick={handleLogout}
            />
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main style={contentArea}>
          {activeView === 'dashboard' && <DashboardPage />}
          {/* {activeView === 'dashboard' && <DashboardStats
            revenueData={revenueData}
            orders={orders}
            dashboardStats={dashboardStats}
            customer={customer}
            orderStatus={orderStatus}
          />} */}

          {activeView === 'users' && <UserPage />}

          {activeView === 'products' && <ProductPage />}

          {activeView === 'orders' && <OrdersPage />}

          {activeView === 'locations' && <LocationPage />}

          {activeView === 'catalog' && <CatalogMainPage />}

          {activeView === 'inventory' && <InventoryPage />}

          {activeView === 'content' && children}
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  icon?: string;
  isActive?: boolean;
  onClick: () => void;
}

function SidebarItem({ label, icon, isActive = false, onClick }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...sidebarItem,
        background: isActive ? "#e0f2fe" : "#fff",
        borderLeft: isActive ? "3px solid #2563eb" : "none",
      }}
    >
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      {label}
    </div>
  );
}

function DashboardStats({
  revenueData,
  orders,
  dashboardStats,
  customer,
  orderStatus,
}: DashboardStatsProps) {
  return (
    <div style={dashboardContainer}>
      <div style={statsHeader}>
        <h2 style={statsTitle}>Dashboard Overview</h2>
        <p style={statsSubtitle}>Today's key metrics at a glance</p>
      </div>

      {/* Revenue Cards */}
      <div style={statsGrid}>
        <div style={statCard}>
          <div style={statIcon}>₹</div>
          <h3 style={statLabel}>Today's Revenue</h3>
          <div style={statValue}>₹{revenueData.todayRevenue.toLocaleString()}</div>
        </div>

        <div style={statCard}>
          <div style={statIcon}>📅</div>
          <h3 style={statLabel}>Monthly Revenue</h3>
          <div style={statValue}>₹{revenueData.thisMonthRevenue.toLocaleString()}</div>
        </div>

        <div style={statCard}>
          <div style={statIcon}>📦</div>
          <h3 style={statLabel}>Today's Orders</h3>
          <div style={statValue}>{orders.today.toLocaleString()}</div>
        </div>

        <div style={statCard}>
          <div style={statIcon}>📊</div>
          <h3 style={statLabel}>Total Orders</h3>
          <div style={statValue}>{dashboardStats.total_orders.toLocaleString()}</div>
        </div>
      </div>

      {/* Bottom Row - Customers & Inventory */}
      <div style={statsGridSecondary}>
        <div style={statCardSecondary}>
          <div style={statIconSecondary}>👥</div>
          <h3 style={statLabel}>New Customers Today</h3>
          <div style={statValueSecondary}>{customer.today}</div>
        </div>

        <div style={statCardSecondary}>
          <div style={statIconSecondary}>🛒</div>
          <h3 style={statLabel}>Total Users</h3>
          <div style={statValueSecondary}>{dashboardStats.total_users.toLocaleString()}</div>
        </div>

        <div style={statCardSecondary}>
          <div style={statIconSecondary}>📈</div>
          <h3 style={statLabel}>Total Sales</h3>
          <div style={statValueSecondary}>₹{dashboardStats.total_sales.toLocaleString()}</div>
        </div>

        <div style={statCardSecondary}>
          <div style={statIconSecondary}>📦</div>
          <h3 style={statLabel}>Inventory Left</h3>
          <div style={statValueSecondary}>{dashboardStats.total_inventory_left.toLocaleString()}</div>
        </div>
      </div>

      {/* Order Status */}
      <div style={orderStatusSection}>
        <h3 style={sectionTitle}>Order Status</h3>
        <div style={orderStatusGrid}>
          <div style={statusCard('pending')}>
            <div style={statusNumber}>{orderStatus.pending}</div>
            <div style={statusLabel}>Pending</div>
          </div>
          <div style={statusCard('shipped')}>
            <div style={statusNumber}>{orderStatus.shipped}</div>
            <div style={statusLabel}>Shipped</div>
          </div>
          <div style={statusCard('delivered')}>
            <div style={statusNumber}>{orderStatus.delivered}</div>
            <div style={statusLabel}>Delivered</div>
          </div>
          <div style={statusCard('cancelled')}>
            <div style={statusNumber}>{orderStatus.cancelled}</div>
            <div style={statusLabel}>Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
}




/* ---------- STYLES ---------- */

const appContainer: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#f8fafc",
};

const mainLayout: React.CSSProperties = {
  flex: 1,
  display: "flex",
  overflow: "hidden",
};

const sidebarStyle: React.CSSProperties = {
  width: 260,
  background: "#ffffff",
  borderRight: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 10px rgba(0,0,0,0.05)",

  justifyContent: "space-between",
};

const sidebarHeader: React.CSSProperties = {
  padding: "24px 20px 16px",
  borderBottom: "1px solid #f1f5f9",
};

const sidebarTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 600,
  color: "#1e293b",
};

const navStyle: React.CSSProperties = {
  flex: 1,
  padding: "12px 0",
  overflowY: "auto",
};

const sidebarItem: React.CSSProperties = {
  padding: "14px 20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  fontSize: 14,
  color: "#475569",
  transition: "all 0.2s",
  borderRadius: "0 12px 12px 0",
  margin: "2px 4px",
};

const contentArea: React.CSSProperties = {
  flex: 1,
  overflow: "auto",
  padding: 32,
};

// Dashboard Styles
const dashboardContainer: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  height: "100%",
  padding: "20px",
  maxWidth: "100%",
  overflowX: "hidden",
};

const statsHeader = {
  marginBottom: "24px",
  paddingBottom: "16px",
  borderBottom: "1px solid #f1f5f9",
};

const statsTitle = {
  margin: "0 0 4px 0",
  fontSize: "24px",
  fontWeight: 700,
  color: "#1e293b",
};

const statsSubtitle = {
  margin: 0,
  color: "#64748b",
  fontSize: "14px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "24px",
};

const statsGridSecondary = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginBottom: "24px",
};

const statCard: React.CSSProperties = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
};

const statIcon = {
  fontSize: "28px",
  marginBottom: "12px",
};

const statLabel = {
  fontSize: "14px",
  margin: "8px 0",
  opacity: 0.9,
  fontWeight: 500,
};

const statValue = {
  fontSize: "28px",
  fontWeight: 700,
  margin: 0,
};

const statCardSecondary: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const statIconSecondary = {
  fontSize: "24px",
  marginBottom: "8px",
};

const statValueSecondary = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#1e293b",
  marginTop: "4px",
};

const orderStatusSection = {
  background: "#f8fafc",
  padding: "24px",
  borderRadius: "12px",
  marginTop: "16px",
};

const sectionTitle = {
  margin: "0 0 16px 0",
  fontSize: "18px",
  fontWeight: 600,
  color: "#1e293b",
};

const orderStatusGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "16px",
};

function statusCard(
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
): React.CSSProperties {
  const colors = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    shipped: { bg: "#dbeafe", text: "#1e40af" },
    delivered: { bg: "#dcfce7", text: "#166534" },
    cancelled: { bg: "#fee2e2", text: "#991b1b" },
  };

  const color = colors[status];

  return {
    background: color.bg,
    padding: "16px",
    borderRadius: "8px",
    textAlign: "center", // ✅ now correctly typed
    border: `1px solid ${color.bg}`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };
}


const statusNumber = {
  fontSize: "24px",
  fontWeight: 700,
  marginBottom: "4px",
};

const statusLabel = {
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const logoutContainer: React.CSSProperties = {
  borderTop: "1px solid #f1f5f9",
  padding: "12px 0",
};