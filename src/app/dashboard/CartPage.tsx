"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { getAbandonedCart, getCartSummary } from "@/src/services/authService/authService";

interface Cart {
  userId: number;
  userName: string;
  userEmail: string;
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  lastActivity: string;
  cartAge: string;
  items: any;
}

export default function CartPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const res = await getCartSummary();
      const abandonedRes = await getAbandonedCart();
      if (res?.content) {
        setCarts(res.content);
      }
      if (abandonedRes?.content) {
        setAbandonedCarts(abandonedRes.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isOldCart = (cartAge: string) => {
    const [value, unit] = cartAge.split(" ");
    const num = parseInt(value);
    if (unit.startsWith("day")) return num >= 3;
    return false;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={3}>
        Cart Overview
      </Typography>

      {carts.map((cart) => (
        <Card
          key={cart.userId}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography fontWeight={600}>
                  {cart.userName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cart.userEmail}
                </Typography>
              </Box>

              <Chip
                label={`Cart Age: ${cart.cartAge}`}
                color={isOldCart(cart.cartAge) ? "error" : "secondary"}
                size="small"
              />
            </Box>

            <Box
              mt={3}
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
              gap={2}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Items
                </Typography>
                <Typography fontWeight={600}>
                  {cart.totalItems}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Quantity
                </Typography>
                <Typography fontWeight={600}>
                  {cart.totalQuantity}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Value
                </Typography>
                <Typography fontWeight={600}>
                  ₹{cart.totalValue}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Activity
                </Typography>
                <Typography fontWeight={600}>
                  {new Date(cart.lastActivity).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {carts.length === 0 && !loading && (
        <Typography>No cart data available.</Typography>
      )}
      {abandonedCarts.length > 0 && (
        <>
          <Typography variant="h5" mt={5} mb={3}>
            Abandoned Carts (&gt; 48 Hours)
          </Typography>

          {abandonedCarts.map((cart) => (
            <Card
              key={`abandoned-${cart.userId}`}
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid #ffe0e0",
                background: "#fff8f8",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {cart.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cart.userEmail}
                    </Typography>
                  </Box>

                  <Chip
                    label="Abandoned"
                    color="error"
                    size="small"
                  />
                </Box>

                <Box
                  mt={3}
                  display="grid"
                  gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                  gap={2}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Items
                    </Typography>
                    <Typography fontWeight={600}>
                      {cart.totalItems}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Quantity
                    </Typography>
                    <Typography fontWeight={600}>
                      {cart.totalQuantity}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                    <Typography fontWeight={600}>
                      ₹{cart.totalValue}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Activity
                    </Typography>
                    <Typography fontWeight={600}>
                      {new Date(cart.lastActivity).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}