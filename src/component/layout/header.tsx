"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Notifications } from "@mui/icons-material";
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Tooltip } from "@mui/material";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("refreshToken");
    if (!token && !pathname.includes("/auth/login")) {
      router.push("/auth/login");
    }
  }, [isClient, pathname, router]);

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

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Notifications">
          <IconButton sx={{ color: "white", "&:hover": { background: "rgba(255,255,255,0.1)" }, transition: "all 0.3s ease" }}>
            <Notifications sx={{ fontSize: 24 }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Profile">
          <IconButton sx={{ p: 0, "&:hover": { transform: "scale(1.1)", bgcolor: "rgba(255,255,255,0.1)" }, transition: "all 0.3s ease" }}>
            <Avatar sx={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600, fontSize: "1rem" }}>
              RN
            </Avatar>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}