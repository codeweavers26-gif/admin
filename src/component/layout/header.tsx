// "use client";

// import Link from "next/link";

// export default function Header() {
//   return (
//     <header
//       style={{
//         height: "45px",
//         background: "#b3aec7ff",
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         padding: "0 20px",
//       }}
//     >
//       <h3>Admin Panel</h3>
//       <div style={{ fontSize: 20, fontWeight: 700 }}>
//         RichNRetired
//       </div>

//       <nav style={{ display: "flex", gap: "20px" }}>
//         <Link href="auth/login">Login</Link>
//       </nav>
//     </header>
//   );
// }

"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Notifications,
  AccountCircle,
  Menu as MenuIcon
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip
} from "@mui/material";

export default function Header() {

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
          {/* <IconButton
            size="large"
            sx={{
              color: "white",
              background: "rgba(255,255,255,0.2)",
              "&:hover": { background: "rgba(255,255,255,0.3)" },
              transition: "all 0.3s ease"
            }}
          >
            <MenuIcon />
          </IconButton> */}
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

        {/* Login Button */}
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
      </Toolbar>
    </AppBar>
  );
}
