import React, { useState } from 'react';
import {
  Typography, Box, Card, CardContent, Grid, Button,
  Stepper, Step, StepLabel, StepContent, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  useTheme, useMediaQuery, Fade, Zoom
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  Lightbulb as LightbulbIcon,
  TrendingUp as TrendingUpIcon,
  Shield as ShieldIcon,
  Support as SupportIcon,
  Payment as PaymentIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

const NavigationGuide = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      label: 'Welcome to ProxyVanta',
      description: 'Your premium PIA S5 proxy service dashboard',
      icon: <LightbulbIcon />,
      color: 'primary.main'
    },
    {
      label: 'Manage Your Wallet',
      description: 'Add funds, check balance, and view transactions',
      icon: <WalletIcon />,
      color: 'success.main'
    },
    {
      label: 'Purchase Proxies',
      description: 'Choose and buy proxy packages that fit your needs',
      icon: <ShoppingCartIcon />,
      color: 'secondary.main'
    },
    {
      label: 'Access Credentials',
      description: 'Download and manage your proxy credentials',
      icon: <SecurityIcon />,
      color: 'info.main'
    },
    {
      label: 'Track Orders',
      description: 'Monitor your purchase history and order status',
      icon: <HistoryIcon />,
      color: 'warning.main'
    }
  ];

  const features = [
    {
      title: 'Secure Proxy Network',
      description: 'High-speed, reliable PIA S5 proxies with 99.9% uptime guarantee',
      icon: <ShieldIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      benefits: ['Residential IPs', 'Rotating proxies', 'Global coverage']
    },
    {
      title: 'Easy Management',
      description: 'User-friendly dashboard to manage all your proxy needs',
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      benefits: ['Real-time monitoring', 'Instant activation', 'Auto-renewal']
    },
    {
      title: '24/7 Support',
      description: 'Get help whenever you need it with our support team',
      icon: <SupportIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      benefits: ['Live chat support', 'Email assistance', 'Quick response']
    },
    {
      title: 'Flexible Payments',
      description: 'Multiple payment options for your convenience',
      icon: <PaymentIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      benefits: ['Mobile money', 'Bank transfer', 'Crypto payments']
    }
  ];

  const quickActions = [
    {
      title: 'Add Funds',
      description: 'Top up your wallet to purchase proxies',
      icon: <WalletIcon />,
      path: '/wallet',
      color: 'success'
    },
    {
      title: 'Buy Proxies',
      description: 'Browse and purchase proxy packages',
      icon: <ShoppingCartIcon />,
      path: '/purchase',
      color: 'primary'
    },
    {
      title: 'Get Credentials',
      description: 'Download your proxy configuration',
      icon: <GetAppIcon />,
      path: '/credentials',
      color: 'secondary'
    },
    {
      title: 'View History',
      description: 'Check your order and transaction history',
      icon: <HistoryIcon />,
      path: '/orders',
      color: 'info'
    }
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Disable auto-close on backdrop click or escape
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      TransitionComponent={Fade}
      transitionDuration={600}
      disableEscapeKeyDown // Prevent closing with escape key
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #3f51b5 100%)',
        color: 'white',
        p: 3,
        position: 'relative'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{
              bgcolor: 'secondary.main',
              mr: 2,
              boxShadow: '0 4px 12px rgba(255,111,0,0.3)'
            }}>
              <LightbulbIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
                Welcome to ProxyVanta!
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Your complete guide to navigating our platform
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, maxHeight: isMobile ? 'none' : '70vh', overflow: 'auto' }}>
        {/* Getting Started Section */}
        <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            🚀 Getting Started
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Follow these simple steps to get the most out of your ProxyVanta experience
          </Typography>

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar sx={{
                      bgcolor: step.color,
                      width: 32,
                      height: 32,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      {step.icon}
                    </Avatar>
                  )}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    {step.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        mt: 1,
                        mr: 1,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                        }
                      }}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1, borderRadius: 2 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {activeStep === steps.length && (
            <Zoom in={activeStep === steps.length}>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  You're all set!
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  You now know how to navigate ProxyVanta. Start exploring your dashboard!
                </Typography>
                <Button onClick={handleReset} variant="outlined" sx={{ borderRadius: 2 }}>
                  Review Again
                </Button>
              </Box>
            </Zoom>
          )}
        </Box>

        {/* Features Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
            ✨ Why Choose ProxyVanta?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ fontWeight: 700, ml: 2 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {feature.benefits.map((benefit, idx) => (
                        <Chip
                          key={idx}
                          label={benefit}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions Section */}
        <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
            🎯 Quick Actions
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Jump straight to the most common tasks
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  textAlign: 'center',
                  p: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => {
                  window.location.href = action.path;
                  onClose();
                }}
                >
                  <Avatar sx={{
                    bgcolor: `${action.color}.main`,
                    width: 48,
                    height: 48,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.3 }}>
                    {action.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Tips Section */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
            💡 Pro Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: 'primary.50',
                border: '1px solid',
                borderColor: 'primary.200'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                  Keep Your Balance Topped Up
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Maintain sufficient funds in your wallet for uninterrupted proxy service
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: 'success.50',
                border: '1px solid',
                borderColor: 'success.200'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                  Download Credentials Immediately
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Save your proxy credentials right after purchase for easy access
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: 'warning.50',
                border: '1px solid',
                borderColor: 'warning.200'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'warning.main' }}>
                  Monitor Your Usage
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Keep track of your proxy usage to avoid unexpected charges
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: 'info.50',
                border: '1px solid',
                borderColor: 'info.200'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
                  Contact Support Early
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Reach out to our support team if you encounter any issues
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Close Guide
        </Button>
        <Button
          onClick={() => {
            setActiveStep(0);
            onClose();
          }}
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          Start Exploring
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavigationGuide;