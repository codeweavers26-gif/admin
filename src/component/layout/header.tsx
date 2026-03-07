"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Notifications, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip } from "@mui/material";
import { adminlogout } from "../../services/authService/authService";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch and only check tokens on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // keep token state in sync with localStorage and navigation
  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem("refreshToken");
    setRefreshToken(token);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "refreshToken") {
        setRefreshToken(e.newValue);
        // If refresh token is cleared, redirect to login
        if (!e.newValue && !pathname.includes("/auth/login")) {
          router.push("/auth/login");
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isClient, pathname, router]);

  const handleLogout = async () => {
    try {
      await adminlogout({ message: "logout" });
    } catch (e) {
      console.error("logout failed", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie = "accessToken=; Max-Age=0; path=/";
      document.cookie = "refreshToken=; Max-Age=0; path=/";
      setRefreshToken(null);
      router.push("/auth/login");
      router.refresh();
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        height: 60,
        background: "linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      <Toolbar sx={{ height: "100%", gap: 2 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              background: "linear-gradient(45deg, #fff 30%, #f0f0ff 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px"
            }}
          >
            RichNRetired
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Tooltip title="Notifications">
          <IconButton sx={{
            color: "white",
            "&:hover": { background: "rgba(255,255,255,0.1)" },
            transition: "all 0.3s ease"
          }}>
            <Notifications sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <IconButton sx={{
            p: 0,
            "&:hover": {
              transform: "scale(1.1)",
              bgcolor: "rgba(255,255,255,0.1)"
            },
            transition: "all 0.3s ease"
          }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem"
              }}
            >
              RN
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Login / Logout Button */}
        {refreshToken ? (
          <button
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              textDecoration: "none",
              padding: "8px 20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 600,
              letterSpacing: "0.5px",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
              display: "inline-block",
            }}
          >
            Logout
            <style jsx>{`
            button:hover {
              background: rgba(255,255,255,0.25) !important;
              transform: translateY(-2px) !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }
          `}</style>
          </button>
        ) : (
          <Link
            href="/auth/login"
            style={{
              textDecoration: "none",
              padding: "8px 20px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 600,
              letterSpacing: "0.5px",
              border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.3s ease",
              display: "inline-block"
            }}
          >
            Login
            <style jsx>{`
            a:hover {
              background: rgba(255,255,255,0.25) !important;
              transform: translateY(-2px) !important;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            }
          `}</style>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
}
