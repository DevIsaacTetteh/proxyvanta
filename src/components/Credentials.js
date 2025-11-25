import React, { useState, useEffect } from 'react';
import {
  Typography, Box, Alert, Card, CardContent, Grid, IconButton,
  InputAdornment, TextField, Chip, Divider, Container, CircularProgress
} from '@mui/material';
import {
  ContentCopy, Visibility, VisibilityOff, Security, AccessTime,
  CheckCircle, Info
} from '@mui/icons-material';
import api from '../services/api';

const Credentials = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proxy/orders');
      setOrders(response.data.orders || []);
    } catch (err) {
      setError('Failed to load credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const togglePasswordVisibility = (orderId) => {
    setShowPasswords(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const ordersWithCredentials = orders.filter(order => order.proxy && order.status === 'completed');

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Your Proxy Credentials
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Access your purchased proxy credentials below. Keep these credentials secure and do not share them.
          </Typography>
        </Box>

        {/* Usage Instructions */}
        <Alert
          severity="info"
          icon={<Info />}
          sx={{
            mb: 4,
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            How to Use Your Credentials
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            1. Download and install the PIA S5 Control App from the official PIA website.<br/>
            2. Open the app and select "Login with existing account".<br/>
            3. Enter your username and password from your purchased credentials.<br/>
            4. Configure your proxy settings using the provided IP count ({ordersWithCredentials.length > 0 ? ordersWithCredentials[0].proxy.TotalIp : 'N'} IPs).<br/>
            5. Start using your secure proxy connection!
          </Typography>
        </Alert>

        {ordersWithCredentials.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Security sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Credentials Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You haven't purchased any proxies yet. Visit the Purchase page to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {ordersWithCredentials.map((order, index) => (
              <Grid item xs={12} md={6} key={order.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: index === 0 ? '2px solid #1976d2' : '1px solid rgba(0,0,0,0.08)',
                    position: 'relative'
                  }}
                >
                  {index === 0 && (
                    <Chip
                      label="Latest Purchase"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {order.proxy.TotalIp} IP Proxy Package
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                      <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">
                        Purchased on {formatDate(order.createdAt)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Username Field */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={order.proxy.username}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => copyToClipboard(order.proxy.username, `username-${order.id}`)}
                                size="small"
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    {/* Password Field */}
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Password"
                        type={showPasswords[order.id] ? 'text' : 'password'}
                        value={order.proxy.password}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => togglePasswordVisibility(order.id)}
                                size="small"
                                sx={{ mr: 0.5 }}
                              >
                                {showPasswords[order.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                              <IconButton
                                onClick={() => copyToClipboard(order.proxy.password, `password-${order.id}`)}
                                size="small"
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    {/* IP Count Display */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Total IPs:
                      </Typography>
                      <Chip
                        label={`${order.proxy.TotalIp} IPs`}
                        variant="outlined"
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Copy Success Message */}
        {copied && (
          <Alert
            severity="success"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
              minWidth: 250
            }}
          >
            {copied.startsWith('username') ? 'Username' : 'Password'} copied to clipboard!
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Credentials;