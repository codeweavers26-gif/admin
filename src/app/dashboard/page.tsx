"use client";

import { ReactNode, } from "react";
import { useRouter } from "next/navigation";
import { adminlogout } from "../../services/authService/authService";
import { useState } from "react";
import UserPage from "./userPage";
import OrdersPage from "./OrdersPage";
import LocationPage from "./LocationPage";
import DashboardPage from "./DashboadPage";
import CatalogMainPage from "./CatalogMainPage";
import ProductPage from "./ProductPage";
import InventoryPage from "./InventoryPage";
import ReturnPage from "./ReturnPage";
import CartPage from "./CartPage";


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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'users' | 'products' | 'orders' | 'locations' | 'catalog' | 'inventory' | 'return' | 'cart'>('dashboard');


  const handleLogout = async () => {
    try {
      const res = await adminlogout({ message: "logout" });
      if (res) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch { }
    finally {
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      router.push("/auth/login");
      router.refresh();
    }
  };

  const showDashboard = () => { setActiveView('dashboard'); };
  const showProducts = () => { setActiveView('products'); };
  const showOrders = () => { setActiveView('orders'); };
  const showLocations = () => { setActiveView('locations'); };
  const showUsers = () => { setActiveView('users'); };
  const showCatalog = () => { setActiveView('catalog'); };
  const showInventory = () => { setActiveView('inventory'); };
  const showReturn = () => { setActiveView('return'); };
  const showCart = () => { setActiveView('cart'); };

  return (
    <div style={appContainer}>
      {/* MAIN LAYOUT */}
      <div style={mainLayout}>
        {/* LEFT SIDEBAR */}
        <aside style={sidebarStyle(isCollapsed)}>
          <div>
            <div style={sidebarHeader}>
              {/* <h3 style={sidebarTitle}>Menu</h3> */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {!isCollapsed && <h3 style={sidebarTitle}>Menu</h3>}

                <div
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  {isCollapsed ? "➡️" : "⬅️"}
                </div>
              </div>
            </div>

            <nav style={navStyle}>
              <SidebarItem
                label="Dashboard"
                icon="📊"
                isActive={activeView === 'dashboard'}
                onClick={showDashboard}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Users"
                icon="👥"
                isActive={activeView === 'users'}
                onClick={showUsers}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Products"
                icon="🛍️"
                isActive={activeView === 'products'}
                onClick={showProducts}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Orders"
                icon="📦"
                isActive={activeView === 'orders'}
                onClick={showOrders}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Locations"
                icon="📍"
                isActive={activeView === 'locations'}
                onClick={showLocations}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Catalog"
                icon="📚"
                isActive={activeView === 'catalog'}
                onClick={showCatalog}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Inventory"
                icon="📋"
                isActive={activeView === 'inventory'}
                onClick={showInventory}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Return"
                icon="↩️"
                isActive={activeView === 'return'}
                onClick={showReturn}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                label="Cart"
                icon="🛒"
                isActive={activeView === 'cart'}
                onClick={showCart}
                isCollapsed={isCollapsed}
              />
            </nav>
          </div>
          <div style={logoutContainer}>
            <SidebarItem
              label="Logout"
              icon="🚪"
              onClick={handleLogout}
              isCollapsed={isCollapsed}
            />
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main style={contentArea}>
          {activeView === 'dashboard' && <DashboardPage />}

          {activeView === 'users' && <UserPage />}

          {activeView === 'products' && <ProductPage />}

          {activeView === 'orders' && <OrdersPage />}

          {activeView === 'locations' && <LocationPage />}

          {activeView === 'catalog' && <CatalogMainPage />}

          {activeView === 'inventory' && <InventoryPage />}

          {activeView === 'return' && <ReturnPage />}

          {activeView === 'cart' && <CartPage />}
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
  isCollapsed?: boolean;
}

function SidebarItem({ label, icon, isActive = false, onClick, isCollapsed = false, }: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        ...sidebarItem,
        background: isActive ? "#e0f2fe" : "#fff",
        borderLeft: isActive ? "3px solid #2563eb" : "none",
        justifyContent: isCollapsed ? "center" : "flex-start",
      }}
      title={label}
    >
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      {!isCollapsed && <span style={{ marginLeft: 8 }}>{label}</span>}
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
const sidebarStyle = (isCollapsed: boolean): React.CSSProperties => ({
  width: isCollapsed ? 70 : 260,
  background: "#ffffff",
  borderRight: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
  justifyContent: "space-between",
  transition: "width 0.3s ease",
});

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

const logoutContainer: React.CSSProperties = {
  borderTop: "1px solid #f1f5f9",
  padding: "12px 0",
};