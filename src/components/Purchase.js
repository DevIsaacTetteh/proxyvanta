import React, { useState, useEffect } from 'react';
import {
  Button, Typography, Box, Alert, Card, CardContent, Grid, IconButton,
  Paper, Divider, Chip, Container
} from '@mui/material';
import { ShoppingCart, AccountBalanceWallet, Refresh as RefreshIcon, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Purchase = () => {
  const [selectedIPs, setSelectedIPs] = useState(5);
  const [balance, setBalance] = useState(0);
  const [pricingGroups, setPricingGroups] = useState([]);
  const [proxyStats, setProxyStats] = useState([]);
  const [dollarRate, setDollarRate] = useState(12); // Default rate
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPricePerIP = (qty) => {
    const group = pricingGroups.find(g => qty >= g.min && qty <= g.max);
    return group ? group.price : 10; // Default fallback
  };

  const pricePerIP = getPricePerIP(selectedIPs);
  const totalPriceGHS = selectedIPs * pricePerIP;
  const pricePerIPUSD = pricePerIP / dollarRate;
  const totalPriceUSD = totalPriceGHS / dollarRate;

  const ipOptions = [5, 10, 25, 50, 100, 200, 300, 400, 800, 1000, 1200, 1600, 2200, 3000];

  useEffect(() => {
    fetchBalance();
    fetchPricing();
    fetchProxyStats();
    fetchDollarRate();
    
    // Refresh pricing and dollar rate every 30 seconds to ensure current rates
    const pricingInterval = setInterval(() => {
      fetchPricing();
      fetchDollarRate();
    }, 30 * 1000);
    
    return () => clearInterval(pricingInterval);
  }, []);

  useEffect(() => {
    // Fetch fresh proxy stats when IP tier selection changes
    fetchProxyStats();
  }, [selectedIPs]);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/wallet/balance');
      setBalance(response.data?.balance ?? 0);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(0);
    }
  };

  const fetchPricing = async () => {
    try {
      console.log('Fetching pricing from API...');
      const response = await api.get('/auth/pricing');
      console.log('API Response:', response);
      if (response.data && response.data.pricings && response.data.pricings.length > 0) {
        console.log('Setting pricing from database:', response.data.pricings);
        setPricingGroups(response.data.pricings);
      } else {
        console.log('No pricing in database, using admin defaults');
        // Use the same defaults as admin pricing config
        setPricingGroups([
          { range: '5 IPs', min: 5, max: 5, price: 10 },
          { range: '10 IPs', min: 10, max: 10, price: 9 },
          { range: '25 IPs', min: 25, max: 25, price: 8 },
          { range: '50 IPs', min: 50, max: 50, price: 7 },
          { range: '100 IPs', min: 100, max: 100, price: 6 },
          { range: '200 IPs', min: 200, max: 200, price: 5 },
          { range: '300 IPs', min: 300, max: 300, price: 4 },
          { range: '400 IPs', min: 400, max: 400, price: 3.5 },
          { range: '800 IPs', min: 800, max: 800, price: 3 },
          { range: '1000 IPs', min: 1000, max: 1000, price: 2.5 },
          { range: '1200 IPs', min: 1200, max: 1200, price: 2.2 },
          { range: '1600 IPs', min: 1600, max: 1600, price: 2 },
          { range: '2200 IPs', min: 2200, max: 2200, price: 1.8 },
          { range: '3000 IPs', min: 3000, max: 3000, price: 1.5 }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch pricing from API:', error);
      console.log('Using fallback pricing');
      // Fallback pricing (same as admin defaults)
      setPricingGroups([
        { range: '5 IPs', min: 5, max: 5, price: 10 },
        { range: '10 IPs', min: 10, max: 10, price: 9 },
        { range: '25 IPs', min: 25, max: 25, price: 8 },
        { range: '50 IPs', min: 50, max: 50, price: 7 },
        { range: '100 IPs', min: 100, max: 100, price: 6 },
        { range: '200 IPs', min: 200, max: 200, price: 5 },
        { range: '300 IPs', min: 300, max: 300, price: 4 },
        { range: '400 IPs', min: 400, max: 400, price: 3.5 },
        { range: '800 IPs', min: 800, max: 800, price: 3 },
        { range: '1000 IPs', min: 1000, max: 1000, price: 2.5 },
        { range: '1200 IPs', min: 1200, max: 1200, price: 2.2 },
        { range: '1600 IPs', min: 1600, max: 1600, price: 2 },
        { range: '2200 IPs', min: 2200, max: 2200, price: 1.8 },
        { range: '3000 IPs', min: 3000, max: 3000, price: 1.5 }
      ]);
    }
  };

  const fetchProxyStats = async () => {
    try {
      const response = await api.get('/pia/stats');
      setProxyStats(response.data.ipTierStats || []);
    } catch (error) {
      console.error('Failed to fetch proxy stats:', error);
      setProxyStats([]);
    }
  };

  const fetchDollarRate = async () => {
    try {
      const response = await api.get('/auth/dollar-rate');
      if (response.data && response.data.rate) {
        setDollarRate(response.data.rate);
      }
    } catch (error) {
      console.error('Failed to fetch dollar rate:', error);
      // Keep default rate of 12
    }
  };

  const getAvailableStock = (ipCount) => {
    const stat = proxyStats.find(s => s.ip === ipCount);
    return stat ? stat.totalAvailable : 0;
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    // Check available stock for selected IP tier
    const availableStock = getAvailableStock(selectedIPs);
    if (availableStock <= 0) {
      setError(`No ${selectedIPs} IP proxies are currently available. Please try a different IP tier.`);
      setLoading(false);
      return;
    }

    if (balance < totalPriceGHS) {
      setError('Insufficient wallet balance');
      setLoading(false);
      return;
    }

    try {
      await api.post('/proxy/purchase', { 
        ipCount: selectedIPs,
        country: 'Global' // Default country
      });
      setMessage('Purchase successful! Your proxy credentials are now available.');
      setTimeout(() => navigate('/credentials'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 1
    }}>
      <Container maxWidth="lg">
        {/* Wallet Balance */}
        <Box sx={{ mb: 3 }}>
          <Paper sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <AccountBalanceWallet sx={{ mr: 1.5, color: '#1976d2', fontSize: 28 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Available Balance
              </Typography>
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', fontSize: '1.5rem' }}>
                ${(balance / dollarRate).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.25 }}>
                (₵{balance.toLocaleString()} GHS)
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Available Pricing Tiers Slider */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              pb: 2,
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.5)',
                },
              },
            }}
          >
            {pricingGroups.map((tier, index) => (
              <Card
                key={index}
                sx={{
                  minWidth: '110px',
                  maxWidth: '120px',
                  width: '110px',
                  height: '130px',
                  flexShrink: 0,
                  textAlign: 'center',
                  border: selectedIPs === tier.min ? '2px solid #1976d2' : '1px solid rgba(255,255,255,0.2)',
                  bgcolor: selectedIPs === tier.min ? 'rgba(25, 118, 210, 0.15)' : 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(15px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.03)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.15)',
                    border: selectedIPs === tier.min ? '2px solid #1976d2' : '2px solid rgba(255,255,255,0.4)',
                  },
                  '&::before': selectedIPs === tier.min ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    borderRadius: '4px 4px 0 0',
                  } : {},
                }}
                onClick={() => setSelectedIPs(tier.min)}
              >
                <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{
                      fontWeight: 'bold',
                      color: selectedIPs === tier.min ? '#1976d2' : '#333',
                      fontSize: '0.7rem',
                      lineHeight: 1.1,
                      display: 'block'
                    }}>
                      {tier.range || `${tier.min} IPs`}
                    </Typography>
                    {selectedIPs === tier.min && (
                      <Chip
                        label="Selected"
                        color="primary"
                        size="small"
                        sx={{
                          fontSize: '0.55rem',
                          height: '14px',
                          mt: 0.3,
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="h6" sx={{
                    color: selectedIPs === tier.min ? '#1976d2' : '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mb: 0.3,
                    textShadow: selectedIPs === tier.min ? '0 1px 2px rgba(25, 118, 210, 0.3)' : 'none'
                  }}>
                    ${(tier.price / dollarRate).toFixed(2)}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{
                    fontSize: '0.6rem',
                    fontWeight: '500'
                  }}>
                    per IP (₵{tier.price})
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Scroll Indicator */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            gap: 0.5
          }}>
            {Array.from({ length: Math.ceil(pricingGroups.length / 3) }, (_, i) => (
              <Box
                key={i}
                sx={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Pro Tip */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Paper sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 3,
            py: 1.5,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <TrendingUp sx={{ mr: 1, color: '#1976d2', fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
              Pro Tip: Bulk purchases get better pricing! After purchase, check your Credentials page for PIA S5 Control App login details.
            </Typography>
          </Paper>
        </Box>

        {/* Purchase Configuration */}
        <Card sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: 1.5 }}>
                {/* Current Price Display */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Price per IP
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontSize: '0.7rem', ml: 1 }}>
                      ({getAvailableStock(selectedIPs)} available)
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={fetchPricing}
                      sx={{ ml: 0.5, p: 0.5 }}
                      title="Refresh pricing"
                    >
                      <RefreshIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                    </IconButton>
                  </Box>
                  <Typography variant="h4" sx={{
                    color: '#1976d2',
                    fontWeight: 'bold',
                    fontSize: '2rem'
                  }}>
                    ${pricePerIPUSD.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.25 }}>
                    (₵{pricePerIP} GHS)
                  </Typography>
                  <Box sx={{ mt: 0.25 }}>
                    <Chip
                      label={`${selectedIPs} IPs selected`}
                      sx={{
                        mr: 0.5,
                        bgcolor: '#fff3e0',
                        color: '#f57c00',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        height: 24
                      }}
                    />
                    {pricingGroups.find(g => selectedIPs >= g.min && selectedIPs <= g.max) && (
                      <Chip
                        label={pricingGroups.find(g => selectedIPs >= g.min && selectedIPs <= g.max).range || `${selectedIPs} IPs`}
                        size="small"
                        sx={{
                          bgcolor: '#e8f5e8',
                          color: '#2e7d32',
                          fontSize: '0.65rem',
                          height: 20
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Selection Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600, color: '#333', textAlign: 'center' }}>
                    Configure Your Purchase
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1, color: '#333', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    Select Number of IPs
                  </Typography>
                  <Grid container spacing={0.5}>
                    {ipOptions.map(ip => (
                      <Grid item xs={6} sm={4} md={3} key={ip}>
                        <Button
                          fullWidth
                          variant={selectedIPs === ip ? 'contained' : 'outlined'}
                          onClick={() => setSelectedIPs(ip)}
                          sx={{
                            py: 0.75,
                            fontSize: '0.8rem',
                            borderRadius: 1.5,
                            fontWeight: 'bold',
                            bgcolor: selectedIPs === ip ? '#1976d2' : 'transparent',
                            color: selectedIPs === ip ? 'white' : '#666',
                            border: selectedIPs === ip ? 'none' : '1.5px solid #e0e0e0',
                            '&:hover': {
                              bgcolor: selectedIPs === ip ? '#1565c0' : '#f5f5f5',
                              border: selectedIPs === ip ? 'none' : '1.5px solid #ccc'
                            },
                            boxShadow: selectedIPs === ip ? '0 2px 8px rgba(25, 118, 210, 0.25)' : 'none',
                            transform: selectedIPs === ip ? 'scale(1.02)' : 'scale(1)',
                            transition: 'all 0.15s ease-in-out',
                            minHeight: 32
                          }}
                        >
                          {ip}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Total Price and Purchase */}
                <Box sx={{
                  bgcolor: '#f8f9fa',
                  borderRadius: 2,
                  p: 2,
                  border: '2px solid #e9ecef',
                  mb: 1
                }}>
                  <Box sx={{
                    textAlign: 'center',
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#e8f5e8',
                    borderRadius: 1.5,
                    border: '1.5px solid #4caf50'
                  }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h4" sx={{
                      color: '#2e7d32',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}>
                      ${totalPriceUSD.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.25 }}>
                      (₵{totalPriceGHS.toLocaleString()} GHS)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {selectedIPs} IPs × ${pricePerIPUSD.toFixed(2)} each
                    </Typography>
                  </Box>

                  {/* Purchase Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePurchase}
                    disabled={loading}
                    startIcon={<ShoppingCart />}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      bgcolor: '#2e7d32',
                      '&:hover': {
                        bgcolor: '#1b5e20',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)'
                      },
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                      mb: 1
                    }}
                  >
                    {loading ? 'Processing...' : `Purchase ${selectedIPs} IP Proxy`}
                  </Button>

                  {/* Alerts */}
                  {message && (
                    <Alert severity="success" sx={{ borderRadius: 1.5, fontSize: '0.8rem' }}>
                      {message}
                    </Alert>
                  )}
                  {error && (
                    <Alert severity="error" sx={{ borderRadius: 1.5, fontSize: '0.8rem' }}>
                      {error}
                    </Alert>
                  )}
                </Box>

                {/* Additional Info */}
                <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fff3e0', borderRadius: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    🔒 <strong>Secure Purchase:</strong> Your payment is processed securely. Proxies will be delivered instantly to your account after successful payment.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
      </Container>
    </Box>
  );
};

export default Purchase;