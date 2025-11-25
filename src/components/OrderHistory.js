import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import api from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/proxy/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Loading order history...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: { xs: '60vh', md: '70vh' },
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 1.5, sm: 3, md: 6 },
        backgroundColor: '#f5f7fb'
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          width: '100%'
        }}
      >
        <Box
          sx={{
            mb: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.3rem', sm: '1.5rem' },
              color: 'text.primary'
            }}
          >
            Order History
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: { xs: 'left', sm: 'right' }
            }}
          >
            View all your past proxy purchases in one place.
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 10px 25px rgba(15,23,42,0.08)',
            overflow: 'hidden',
            backgroundColor: '#ffffff'
          }}
        >
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto'
            }}
          >
            <Table
              size="small"
              sx={{
                minWidth: 650,
                '& th': {
                  whiteSpace: 'nowrap'
                },
                '& td': {
                  whiteSpace: 'nowrap'
                }
              }}
            >
          <TableHead>
            <TableRow>
              <TableCell>Quantity</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Total IP</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.country || 'Global'}</TableCell>
                <TableCell>₵{order.totalPrice.toLocaleString()}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.proxy?.username || '-'}</TableCell>
                <TableCell>{order.proxy?.password || '-'}</TableCell>
                <TableCell>{order.proxy?.TotalIp || '-'}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
            </Table>
          </Box>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default OrderHistory;