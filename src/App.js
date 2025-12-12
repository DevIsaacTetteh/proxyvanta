import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Wallet from './components/Wallet';
import Purchase from './components/Purchase';
import Credentials from './components/Credentials';
import OrderHistory from './components/OrderHistory';
import FloatingSupportButton from './components/FloatingSupportButton';
import NavigationGuide from './components/NavigationGuide';
import Dashboard from './components/Dashboard';
import PaymentVerification from './components/PaymentVerification';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ShoppingCart as ShoppingCartIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e', // Deep blue
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#ff6f00', // Orange accent
      light: '#ffa040',
      dark: '#c43e00',
    },
    background: {
      default: '#f5f7f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 800,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
    },
    caption: {
      fontSize: 'clamp(0.7rem, 1.2vw, 0.75rem)',
      lineHeight: 1.5,
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 16,
            sm: 24,
            md: 32,
            lg: 40,
          },
          paddingRight: {
            xs: 16,
            sm: 24,
            md: 32,
            lg: 40,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          margin: {
            xs: 8,
            sm: 16,
            md: 24,
          },
          width: {
            xs: 'calc(100% - 16px)',
            sm: 'auto',
          },
          maxWidth: {
            xs: 'calc(100% - 16px)',
            sm: '600px',
            md: '800px',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: 'auto',
          '& .MuiTable-root': {
            minWidth: {
              xs: 600,
              sm: 700,
              md: '100%',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: {
            xs: 12,
            sm: 16,
            md: 20,
          },
          boxShadow: {
            xs: '0 4px 12px rgba(0,0,0,0.08)',
            sm: '0 6px 20px rgba(0,0,0,0.1)',
            md: '0 8px 32px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 30%, #3f51b5 70%, #5e35b1 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: {
            xs: '12px 16px',
            sm: '14px 20px',
            md: '16px 24px',
          },
          fontSize: {
            xs: '0.85rem',
            sm: '0.9rem',
            md: '0.95rem',
          },
          minHeight: {
            xs: 44,
            sm: 48,
            md: 52,
          },
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: {
            xs: '0.75rem',
            sm: '0.8rem',
            md: '0.85rem',
          },
          height: {
            xs: 28,
            sm: 32,
            md: 36,
          },
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Typography>Loading...</Typography>;
  return user ? children : <Navigate to="/login" />;
};

const Footer = ({ onSupportClick }) => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #3f51b5 100%)',
        color: 'white',
        py: { xs: 4, sm: 5, md: 6 },
        mt: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  mr: 2,
                  width: 48,
                  height: 48,
                  boxShadow: '0 4px 12px rgba(255,111,0,0.3)',
                }}
              >
                <SecurityIcon sx={{ color: 'white', fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  PROXYVANTA
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Premium PIA S5 Proxy Service
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
              Secure, fast, and reliable proxy solutions for your business needs.
              Trusted by professionals worldwide.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { text: 'Purchase Proxies', path: '/purchase' },
                { text: 'Wallet', path: '/wallet' },
                { text: 'Order History', path: '/orders' },
                { text: 'Credentials', path: '/credentials' },
              ].map((link) => (
                <Button
                  key={link.text}
                  component="a"
                  href={link.path}
                  sx={{
                    color: 'white',
                    justifyContent: 'flex-start',
                    p: 0,
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    textTransform: 'none',
                    '&:hover': {
                      color: 'secondary.main',
                      backgroundColor: 'transparent',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  proxyvanta@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +233 55 958 8317
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1.5, fontSize: 18, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Accra, Ghana
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Social Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(255,111,0,0.1)',
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(255,111,0,0.1)',
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'secondary.main',
                    backgroundColor: 'rgba(255,111,0,0.1)',
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            mt: 4,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            © {new Date().getFullYear()} ProxyVanta. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              sx={{
                color: 'white',
                fontSize: '0.8rem',
                textTransform: 'none',
                p: 0,
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Privacy Policy
            </Button>
            <Button
              sx={{
                color: 'white',
                fontSize: '0.8rem',
                textTransform: 'none',
                p: 0,
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Terms of Service
            </Button>
            <Button
              onClick={onSupportClick}
              sx={{
                color: 'white',
                fontSize: '0.8rem',
                textTransform: 'none',
                p: 0,
                '&:hover': {
                  color: 'secondary.main',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Support
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [supportOpen, setSupportOpen] = React.useState(false);
  const [guideOpen, setGuideOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleSupportOpen = () => {
    setSupportOpen(true);
  };

  const handleSupportClose = () => {
    setSupportOpen(false);
  };

  const handleGuideOpen = () => {
    setGuideOpen(true);
  };

  const handleGuideClose = () => {
    setGuideOpen(false);
  };

  const menuItems = [
    { text: 'Wallet', icon: <WalletIcon />, path: '/wallet' },
    { text: 'Purchase Proxies', icon: <ShoppingCartIcon />, path: '/purchase' },
    { text: 'Credentials', icon: <SecurityIcon />, path: '/credentials' },
    { text: 'Order History', icon: <HistoryIcon />, path: '/orders' },
  ];

  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{
          minHeight: {
            xs: 56,
            sm: 64,
            md: 72,
          },
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          }
        }}>
          {/* Logo and Brand */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: { xs: 1, sm: 2, md: 3 }
          }}>
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                mr: { xs: 1, sm: 1.5, md: 2 },
                width: { xs: 36, sm: 40, md: 44 },
                height: { xs: 36, sm: 40, md: 44 },
                boxShadow: '0 4px 12px rgba(255,111,0,0.3)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              <SecurityIcon sx={{
                color: 'white',
                fontSize: { xs: 18, sm: 20, md: 22 }
              }} />
            </Avatar>
            <Box sx={{ display: { xs: 'block', sm: 'block' } }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '0.85rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                PROXYVANTA PIA S5
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.8rem' },
                  lineHeight: 1,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Premium Proxy Service
              </Typography>
            </Box>
            {/* Remove mobile-only brand section */}
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              gap: { xs: 0.5, sm: 1, md: 1.5 },
              ml: 2
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component="a"
                  href={item.path}
                  startIcon={item.icon}
                  sx={{
                    mr: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                    px: { xs: 1.5, sm: 2, md: 2.5 },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <Button
                color="inherit"
                onClick={handleGuideOpen}
                startIcon={<HelpIcon />}
                sx={{
                  mr: 0.5,
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                  px: { xs: 1.5, sm: 2, md: 2.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Help
              </Button>
            </Box>
          )}

          {/* Spacer for mobile */}
          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* User Info and Actions */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5, md: 2 }
          }}>
            {user && (
              <Chip
                label={`₵${user.walletBalance?.toFixed(2) || '0.00'}`}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  height: { xs: 28, sm: 32, md: 36 },
                  display: { xs: 'none', sm: 'flex' },
                  '& .MuiChip-label': {
                    fontWeight: 600,
                    px: { xs: 1, sm: 1.5, md: 2 }
                  }
                }}
                icon={<WalletIcon sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }} />}
              />
            )}

            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenu}
                  sx={{
                    ml: 0.5,
                    p: { xs: 1, sm: 1.25 }
                  }}
                >
                  <MenuIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  {user && (
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <Chip
                        label={`Balance: ₵${user.walletBalance?.toFixed(2) || '0.00'}`}
                        variant="outlined"
                        sx={{
                          width: '100%',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                        icon={<WalletIcon />}
                      />
                    </Box>
                  )}
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      component="a"
                      href={item.path}
                      onClick={handleClose}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(26, 35, 126, 0.08)',
                        }
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { mr: 2, fontSize: 20, color: 'primary.main' }
                      })}
                      <Typography sx={{
                        ml: 0,
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}>
                        {item.text}
                      </Typography>
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      handleGuideOpen();
                    }}
                    sx={{
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(26, 35, 126, 0.08)',
                      }
                    }}
                  >
                    <HelpIcon sx={{ mr: 2, fontSize: 20, color: 'primary.main' }} />
                    <Typography sx={{
                      ml: 0,
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}>
                      Help & Guide
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2, fontSize: 20, color: 'error.main' }} />
                    <Typography sx={{
                      ml: 0,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      color: 'error.main'
                    }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                  px: { xs: 1.5, sm: 2, md: 2.5 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: `calc(100vh - ${isSmallMobile ? 56 : isMobile ? 64 : 72}px)`
      }}>
        {children}
      </Box>

      <Footer onSupportClick={handleSupportOpen} />

      <FloatingSupportButton 
        open={supportOpen} 
        onOpen={handleSupportOpen} 
        onClose={handleSupportClose} 
      />

      <NavigationGuide
        open={guideOpen}
        onClose={handleGuideClose}
      />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/wallet" element={
              <ProtectedRoute>
                <Layout><Wallet /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/purchase" element={
              <ProtectedRoute>
                <Layout><Purchase /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/credentials" element={
              <ProtectedRoute>
                <Layout><Credentials /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout><OrderHistory /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/payment-verification" element={
              <ProtectedRoute>
                <Layout><PaymentVerification /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
