"use client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import React from "react";

interface SnackBarCxProps {
  open: boolean;
  message?: string | string[];
  severity: severityType;
  onClose: () => void;
}
type severityType = "error" | "warning" | "info" | "success";

const SnackBarCx: React.FC<SnackBarCxProps> = ({ open, message, severity, onClose }) => {
  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={onClose}
      >
        {Array.isArray(message) ? (
          <Box sx={{ mt: 3 }}>
            {
              message.map((msg, index) => (
                <Alert
                  key={index}
                  severity={severity}
                  onClose={onClose}
                  sx={{ width: '100%', mb: index !== message.length - 1 ? 1 : 0 }}>
                  {msg}
                </Alert>
              ))
            }
          </Box>
        ) : (
          <Alert
            severity={severity}
            onClose={onClose}
            sx={{ width: '100%', mt: 3 }}>
            {message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default SnackBarCx;
