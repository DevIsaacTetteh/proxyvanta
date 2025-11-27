import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  TextField, Button, Paper, Typography, Box, Alert, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Container, Grid, Chip, Avatar, IconButton, Tooltip,
  Skeleton, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  Campaign as CampaignIcon,
  Announcement as AnnouncementIcon,
  Update as UpdateIcon,
  Build as BuildIcon,
  LocalOffer as PromotionIcon,
  PriorityHigh as HighPriorityIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import api, { getBaseUrl } from '../services/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Add spin animation
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const Wallet = () => {
  const location = useLocation();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Start with loading true
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchWalletData(true); // Mark as initial load
    fetchNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data when location changes (navigation)
  useEffect(() => {
    if (location.pathname) { // Only refresh if we have a location
      fetchWalletData();
    }
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchWalletData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh data when page becomes visible (using Page Visibility API)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchWalletData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchWalletData = async (isInitialLoad = false, retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      if (!isInitialLoad) setRefreshing(true);
      
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions')
      ]);
      
      setBalance(balanceRes.data?.balance ?? 0);
      setTransactions(transactionsRes.data?.transactions ?? []);
      
      // Clear any previous errors on successful load
      setError('');
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      
      // Retry logic for initial load
      if (isInitialLoad && retryCount < maxRetries) {
        console.log(`Retrying data fetch... Attempt ${retryCount + 1}/${maxRetries + 1}`);
        setTimeout(() => {
          fetchWalletData(isInitialLoad, retryCount + 1);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      // Set default values on error
      setBalance(0);
      setTransactions([]);
      
      // Only show error if not initial load or all retries failed
      if (!isInitialLoad || retryCount >= maxRetries) {
        setError('Failed to load wallet data. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
      if (!isInitialLoad) setRefreshing(false);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await api.get('/auth/news');
      setNews(response.data.news || []);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const handleDeposit = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/wallet/deposit', { amount: parseFloat(amount) });

      // Close dialog and redirect to Paystack payment page
      setDialogOpen(false);
      if (response.data.paystackUrl) {
        window.location.href = response.data.paystackUrl;
      } else {
        setMessage('Deposit initialized successfully. Redirecting to payment...');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Deposit failed';
      if (errorMessage.includes('Paystack') || errorMessage.includes('payment')) {
        setError('Payment system is currently being configured. Please contact support for assistance.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getNewsTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return <AnnouncementIcon fontSize="small" />;
      case 'update': return <UpdateIcon fontSize="small" />;
      case 'maintenance': return <BuildIcon fontSize="small" />;
      case 'promotion': return <PromotionIcon fontSize="small" />;
      default: return <CampaignIcon fontSize="small" />;
    }
  };

  const getNewsTypeColor = (type) => {
    switch (type) {
      case 'announcement': return 'primary.main';
      case 'update': return 'info.main';
      case 'maintenance': return 'warning.main';
      case 'promotion': return 'success.main';
      default: return 'secondary.main';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <WarningIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'high': return <HighPriorityIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'medium': return <InfoIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'low': return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      default: return null;
    }
  };

  const textNews = news.filter(item => !item.videoFile && (!item.videoUrl || (!item.videoUrl.startsWith('/uploads/') && !item.videoUrl.startsWith('http'))));
  const videoNews = news.filter(item => item.videoFile || (item.videoUrl && (item.videoUrl.startsWith('/uploads/') || item.videoUrl.startsWith('http'))));

  return (
    <>
    <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 2, sm: 3, md: 4 }
      }}>
      <Container maxWidth={false} disableGutters sx={{ px: 0 }}>
        {/* Latest Announcements Carousel - Top Section */}
        {!newsLoading && textNews.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3, md: 4 } }}>
            <Card sx={{
              background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: { xs: 2, sm: 3 },
                  color: 'white'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CampaignIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Latest Announcements
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  <Slider {...settings}>
                    {textNews.map((item) => (
                      <Box key={item._id} sx={{ px: 1 }}>
                        <Card
                          sx={{
                            minHeight: 200,
                            p: 2.5,
                            borderRadius: 2,
                            background: 'rgba(102, 126, 234, 0.04)',
                            border: '1px solid rgba(102, 126, 234, 0.08)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.08)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                            <Avatar sx={{
                              bgcolor: getNewsTypeColor(item.type),
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 }
                            }}>
                              {getNewsTypeIcon(item.type)}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                  size="small"
                                  sx={{
                                    bgcolor: getNewsTypeColor(item.type),
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 600
                                  }}
                                />
                                <Chip
                                  label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    borderColor:
                                      item.priority === 'critical' || item.priority === 'high' ? 'error.main' :
                                      item.priority === 'medium' ? 'warning.main' : 'success.main',
                                    color:
                                      item.priority === 'critical' || item.priority === 'high' ? 'error.main' :
                                      item.priority === 'medium' ? 'warning.main' : 'success.main'
                                  }}
                                />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                {item.title}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{
                            color: 'text.secondary',
                            lineHeight: 1.5,
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.content}
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: 'text.secondary',
                            display: 'block',
                            mt: 'auto'
                          }}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Card>
                      </Box>
                    ))}
                  </Slider>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Header Section */}
          <Box sx={{
            textAlign: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: { xs: 2, sm: 3, md: 4 },
            color: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            position: 'relative',
            maxWidth: { xs: '100%', sm: '100%', md: 1100 },
            mx: 'auto'
          }}>
            {/* Balance Display - Top Left Corner */}
            <Box sx={{
              position: 'absolute',
              top: { xs: 16, sm: 20 },
              left: { xs: 16, sm: 20 },
              p: { xs: 1.5, sm: 2 },
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: { xs: 120, sm: 140 },
              textAlign: 'center'
            }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  mb: 0.5,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  display: 'block'
                }}
              >
                Balance
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' },
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.01em'
                }}
              >
                {loading ? (
                  <Skeleton variant="text" width={80} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 'auto' }} />
                ) : (
                  `₵${(balance || 0).toLocaleString()}`
                )}
              </Typography>
            </Box>

            {/* Add Funds Button - Top Right Corner */}
            <Box sx={{
              position: 'absolute',
              top: { xs: 12, sm: 16 },
              right: { xs: 12, sm: 16 },
              zIndex: 10
            }}>
              <Button
                onClick={() => setDialogOpen(true)}
                variant="contained"
                sx={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 0.75, sm: 1.1 },
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.8rem', sm: '0.85rem' },
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: 'auto',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <PaymentIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                <Box component="span" sx={{ display: 'inline', whiteSpace: 'nowrap' }}>
                  Add Funds
                </Box>
              </Button>
            </Box>

            <Avatar sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}>
              <WalletIcon sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '-0.02em',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              My Wallet
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
              }}
            >
              Manage your funds securely and track all transactions
            </Typography>
          </Box>

          {/* Loading Overlay for Initial Data Load */}
          {loading && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(4px)'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <CircularProgress size={60} sx={{ mb: 2, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
                  Loading your wallet data...
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  Please wait while we fetch your latest information
                </Typography>
              </Box>
            </Box>
          )}

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 5 }}
            sx={{ width: '100%', px: 0, justifyContent: 'center' }}
          >
            {/* Transaction History Card */}
            <Grid item xs={12}>
              <Card sx={{
                background: 'white',
                borderRadius: { xs: 2, sm: 3 },
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)',
                width: '100%',
                maxWidth: { xs: '100%', sm: '100%', md: 1100 },
                mx: 'auto',
                mb: { xs: 2, sm: 3 },
                minHeight: { xs: 200, sm: 220, md: 260 },
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 10px 32px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ 
                  p: { xs: 1.25, sm: 1.75, md: 2.5, lg: 3, xl: 4 }, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  flexGrow: 1
                }}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
                      <Avatar sx={{
                        bgcolor: 'info.main',
                        mr: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
                        width: { xs: 40, sm: 45, md: 50, lg: 60 },
                        height: { xs: 40, sm: 45, md: 50, lg: 60 },
                        boxShadow: '0 4px 14px rgba(33, 150, 243, 0.3)',
                        flexShrink: 0
                      }}>
                        <HistoryIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24, lg: 28 }, color: 'white' }} />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            color: '#1a1a1a',
                            mb: 0.5,
                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem', lg: '1.5rem' },
                            lineHeight: 1.2
                          }}
                        >
                          Transaction History
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem', lg: '0.875rem' },
                            lineHeight: 1.3
                          }}
                        >
                          Complete record of your financial activities
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Refresh transactions">
                      <IconButton
                        onClick={fetchWalletData}
                        disabled={refreshing}
                        sx={{
                          color: 'primary.main',
                          flexShrink: 0,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <RefreshIcon sx={{
                          fontSize: { xs: 18, sm: 20, md: 24 },
                          animation: refreshing ? `${spin} 1s linear infinite` : 'none'
                        }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {transactions.length === 0 && !loading ? (
                    <Box sx={{
                      textAlign: 'center',
                      py: { xs: 1.5, sm: 2.5, md: 3 },
                      px: { xs: 2, sm: 3 },
                      color: '#999',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <HistoryIcon sx={{
                        fontSize: { xs: 32, sm: 36, md: 42, lg: 48 },
                        mb: { xs: 1.5, sm: 2 },
                        opacity: 0.5,
                        mx: 'auto'
                      }} />
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 1,
                          fontWeight: 500,
                          fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem', lg: '1.25rem' }
                        }}
                      >
                        No transactions yet
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.875rem' },
                          lineHeight: 1.4,
                          maxWidth: 400,
                          mx: 'auto'
                        }}
                      >
                        Your transaction history will appear here once you make deposits or purchases
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{
                      borderRadius: 2,
                      boxShadow: 'none',
                      border: '1px solid rgba(0,0,0,0.08)',
                      maxHeight: { xs: 260, sm: 300, md: 340, lg: 380 },
                      overflowY: 'auto',
                      overflowX: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c1c1c1',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: '#a8a8a8',
                        },
                      },
                      flexGrow: 1
                    }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow sx={{
                            '& .MuiTableCell-head': {
                              bgcolor: 'grey.50',
                              fontWeight: 700,
                              fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                              color: '#333',
                              borderBottom: '2px solid rgba(0,0,0,0.08)',
                              py: { xs: 1.5, sm: 2 }
                            }
                          }}>
                            <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Type</TableCell>
                            <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Amount</TableCell>
                            <TableCell sx={{ minWidth: { xs: 80, sm: 100 } }}>Status</TableCell>
                            <TableCell sx={{ minWidth: { xs: 120, sm: 140 } }}>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow
                              key={transaction._id}
                              sx={{
                                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                                transition: 'background-color 0.2s ease'
                              }}
                            >
                              <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {transaction.type === 'deposit' ? (
                                    <AddIcon sx={{ color: '#4caf50', mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                                  ) : transaction.type === 'purchase' ? (
                                    <PaymentIcon sx={{ color: '#ff9800', mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                                  ) : (
                                    <HistoryIcon sx={{ color: '#2196f3', mr: 1, fontSize: { xs: 16, sm: 18 } }} />
                                  )}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      textTransform: 'capitalize',
                                      fontSize: { xs: '0.8rem', sm: '0.85rem' }
                                    }}
                                  >
                                    {transaction.type}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: transaction.type === 'deposit' ? '#4caf50' : '#f44336',
                                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                                  }}
                                >
                                  {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount?.toLocaleString()}₵
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                                <Chip
                                  label={transaction.status}
                                  size="small"
                                  sx={{
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                    height: { xs: 24, sm: 28 },
                                    ...(transaction.status === 'completed' && {
                                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                                      color: '#4caf50'
                                    }),
                                    ...(transaction.status === 'pending' && {
                                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                                      color: '#ff9800'
                                    }),
                                    ...(transaction.status === 'failed' && {
                                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                                      color: '#f44336'
                                    })
                                  }}
                                  icon={
                                    transaction.status === 'completed' ? <CheckCircleIcon sx={{ fontSize: '0.75rem !important' }} /> :
                                    transaction.status === 'pending' ? <PendingIcon sx={{ fontSize: '0.75rem !important' }} /> :
                                    <CancelIcon sx={{ fontSize: '0.75rem !important' }} />
                                  }
                                />
                              </TableCell>
                              <TableCell sx={{ py: { xs: 1.5, sm: 2 } }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#666',
                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                    lineHeight: 1.3
                                  }}
                                >
                                  {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        {/* Featured Video Updates - Bottom Section */}
        {!newsLoading && videoNews.length > 0 && (
          <Box sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Featured Video Updates
            </Typography>
            <Grid container spacing={3} sx={{ maxWidth: 1100, mx: 'auto' }}>
              {videoNews.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card
                    sx={{
                      minHeight: 320,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          color={
                            item.type === 'announcement' ? 'primary' :
                            item.type === 'update' ? 'info' :
                            item.type === 'maintenance' ? 'warning' :
                            item.type === 'promotion' ? 'success' : 'default'
                          }
                          size="small"
                          sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                        />
                        <Chip
                          label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            borderColor:
                              item.priority === 'critical' ? 'error.main' :
                              item.priority === 'high' ? 'error.main' :
                              item.priority === 'medium' ? 'warning.main' : 'success.main',
                            color:
                              item.priority === 'critical' ? 'error.main' :
                              item.priority === 'high' ? 'error.main' :
                              item.priority === 'medium' ? 'warning.main' : 'success.main'
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {item.title}
                      </Typography>

                      {/* Video Player */}
                      <Box sx={{ mb: 2, flexGrow: 1 }}>
                        {(() => {
                          const videoSrc = item.videoFile
                            ? `${getBaseUrl()}${item.videoFile}`
                            : item.videoUrl.startsWith('/uploads/')
                              ? `${getBaseUrl()}${item.videoUrl}`
                              : item.videoUrl;
                          const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');
                          if (isYouTube) {
                            const videoId = videoSrc.includes('watch?v=') 
                              ? videoSrc.split('v=')[1]?.split('&')[0]
                              : videoSrc.split('youtu.be/')[1]?.split('?')[0];
                            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
                            return (
                              <iframe
                                src={embedUrl}
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  borderRadius: '8px',
                                  border: 'none'
                                }}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title={item.title}
                              ></iframe>
                            );
                          } else {
                            return (
                              <video
                                key={videoSrc}
                                controls
                                muted
                                autoPlay
                                playsInline
                                loop
                                style={{
                                  width: '100%',
                                  height: '200px',
                                  borderRadius: '8px',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                                poster={item.videoThumbnail}
                              >
                                <source src={videoSrc} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            );
                          }
                        })()}
                      </Box>

                      {/* Content (if any) */}
                      {item.content && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {item.content}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mt: 'auto',
                          display: 'block',
                          fontSize: '0.75rem'
                        }}
                      >
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        </Container>
      </Box>

      {/* Add Funds Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{
          textAlign: 'center',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Avatar sx={{
              bgcolor: 'primary.main',
              width: 50,
              height: 50
            }}>
              <PaymentIcon sx={{ fontSize: 28, color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Add Funds to Wallet
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400 }}>
                Secure payment powered by Paystack
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          {message && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontWeight: 500
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Deposit Amount (₵)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              autoFocus
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontWeight: 500,
                  color: '#555'
                }
              }}
              inputProps={{
                min: 1,
                step: 0.01
              }}
              helperText="Minimum deposit: ₵1.00"
            />

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              bgcolor: 'rgba(102, 126, 234, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 32,
                height: 32
              }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: 'white' }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: '#555', fontWeight: 500 }}>
                💳 Your payment is secured by Paystack's industry-leading encryption
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 3,
          pt: 0,
          gap: 2,
          justifyContent: 'center'
        }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (parseFloat(amount) >= 1) {
                handleDeposit();
              }
            }}
            variant="contained"
            disabled={loading || !amount || parseFloat(amount) < 1}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Wallet;