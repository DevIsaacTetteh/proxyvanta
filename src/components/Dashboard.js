import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, Button,
  Avatar, Alert, Fade
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  Help as HelpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import NavigationGuide from './NavigationGuide';

const Dashboard = () => {
  const { user } = useAuth();
  const [guideOpen, setGuideOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Auto-show guide for new users (you can customize this logic)
    const hasSeenGuide = localStorage.getItem('hasSeenNavigationGuide');

    // Only show guide if user hasn't seen it before
    if (!hasSeenGuide || hasSeenGuide !== 'true') {
      // Add a small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        setGuideOpen(true);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }

    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleGuideOpen = () => {
    setGuideOpen(true);
  };

  const handleGuideClose = () => {
    setGuideOpen(false);
    // Mark as seen only when user explicitly closes it
    localStorage.setItem('hasSeenNavigationGuide', 'true');
  };

  // Function to reset guide for testing (can be removed later)
  const resetGuide = () => {
    localStorage.removeItem('hasSeenNavigationGuide');
    setGuideOpen(true);
  };

  const quickActions = [
    {
      title: 'Add Funds',
      description: 'Top up your wallet',
      icon: <WalletIcon sx={{ fontSize: 32 }} />,
      path: '/wallet',
      color: 'success',
      primary: true
    },
    {
      title: 'Buy Proxies',
      description: 'Purchase proxy packages',
      icon: <ShoppingCartIcon sx={{ fontSize: 32 }} />,
      path: '/purchase',
      color: 'primary',
      primary: true
    },
    {
      title: 'View Credentials',
      description: 'Access your proxies',
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      path: '/credentials',
      color: 'secondary',
      primary: true
    },
    {
      title: 'Order History',
      description: 'Track your purchases',
      icon: <HistoryIcon sx={{ fontSize: 32 }} />,
      path: '/orders',
      color: 'info',
      primary: false
    }
  ];

  const stats = [
    {
      label: 'Wallet Balance',
      value: `₵${user?.walletBalance?.toFixed(2) || '0.00'}`,
      icon: <WalletIcon />,
      color: 'success.main'
    },
    {
      label: 'Active Proxies',
      value: '0', // You can fetch this from API
      icon: <SecurityIcon />,
      color: 'primary.main'
    },
    {
      label: 'Total Orders',
      value: '0', // You can fetch this from API
      icon: <HistoryIcon />,
      color: 'secondary.main'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Welcome Message */}
      {showWelcome && (
        <Fade in={showWelcome}>
          <Alert
            severity="info"
            sx={{
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'primary.main'
              }
            }}
            onClose={() => setShowWelcome(false)}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome to ProxyVanta, {user?.username}!
            </Typography>
            <Typography variant="body2">
              Get started by exploring our navigation guide or jumping straight into purchasing your first proxies.
            </Typography>
          </Alert>
        </Fade>
      )}

      {/* Header */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem', lg: '2.5rem' }
              }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Welcome back! Here's your proxy management overview and quick actions.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<HelpIcon />}
            onClick={handleGuideOpen}
            sx={{
              borderRadius: 2,
              px: 3,
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            Navigation Guide
          </Button>
          <Button
            onClick={resetGuide}
            variant="text"
            size="small"
            sx={{
              ml: 1,
              fontSize: '0.75rem',
              color: 'text.secondary',
              display: { xs: 'none', sm: 'inline-flex' }
            }}
          >
            Reset Guide
          </Button>
        </Box>
      </Box>

      {/* SEO Content Section */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: 'primary.main'
          }}
        >
          About ProxyVanta
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            ProxyVanta is Ghana's leading provider of premium SOCKS5 proxies, designed to deliver high-speed, secure, and anonymous internet access for users across the country. Whether you're a developer, marketer, or business professional, our residential SOCKS5 proxies ensure seamless browsing, data scraping, and online activities without compromising your privacy. With a focus on reliability and performance, ProxyVanta offers SOCKS5 proxy Ghana solutions that integrate perfectly with popular tools like the PIA Control App, making it easy to manage your proxy connections on the go.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
            Buy proxy services from ProxyVanta and enjoy instant activation after payment through convenient methods like MTN MoMo, Telecel Cash, debit cards, or bank transfers in Ghana, or cards, bank transfers, and USSD in Nigeria. Our premium SOCKS5 proxies are optimized for speed and stability, providing 24/7 uptime and fast delivery to get you connected in minutes. Experience the difference with residential proxies that work flawlessly with PIA SOCKS5 configurations, ensuring your online presence remains secure and undetectable.
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
            At ProxyVanta, we prioritize customer satisfaction with instant access to your purchased proxies right after payment confirmation. Our SOCKS5 proxy Ghana offerings include dedicated support for PIA login and control, making it simple to switch IPs and maintain anonymity. Choose ProxyVanta for reliable, affordable proxy solutions that power your digital needs—fast, secure, and always available.
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: stat.color,
                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    bgcolor: `${stat.color}15`,
                    width: 56,
                    height: 56
                  }}>
                    {React.cloneElement(stat.icon, {
                      sx: { color: stat.color, fontSize: 28 }
                    })}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
          }}
        >
          Quick Actions
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {quickActions.map((action, index) => (
            <Grid item xs={6} md={action.primary ? 3 : 6} key={index}>
              <Card sx={{
                cursor: 'pointer',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                }
              }}
              onClick={() => window.location.href = action.path}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{
                    bgcolor: `${action.color}.main`,
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.4 }}
                  >
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Getting Started Guide */}
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <StarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
              }}
            >
              New to ProxyVanta?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                mb: 3,
                lineHeight: 1.6
              }}
            >
              Our interactive navigation guide will walk you through all the features and help you get started with managing your proxies like a pro.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<HelpIcon />}
              onClick={handleGuideOpen}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                }
              }}
            >
              Open Navigation Guide
            </Button>
          </Box>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Step-by-Step Guide
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Follow our interactive tutorial to learn all platform features
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Quick Actions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jump straight to common tasks with our quick action buttons
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <HelpIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get help anytime with our comprehensive support system
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Navigation Guide Modal */}
      <NavigationGuide
        open={guideOpen}
        onClose={handleGuideClose}
      />
    </Container>
  );
};

export default Dashboard;