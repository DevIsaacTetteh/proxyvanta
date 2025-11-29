import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
  useTheme,
  Card,
  CardContent,
  Box
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Error as ErrorIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Handle Google OAuth token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');

    if (error) {
      setError('Google authentication failed. Please try again.');
      // Clean URL
      window.history.replaceState({}, document.title, '/login');
      return;
    }

    if (token) {
      // Store token and navigate to wallet
      localStorage.setItem('userToken', token);
      // Clean URL
      window.history.replaceState({}, document.title, '/login');
      navigate('/wallet');
    }
  }, [navigate]);

  // Handle account lockout
  useEffect(() => {
    if (isLocked && lockTimeLeft > 0) {
      const timer = setTimeout(() => {
        setLockTimeLeft(lockTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockTimeLeft === 0) {
      setIsLocked(false);
    }
  }, [isLocked, lockTimeLeft]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt on device:', navigator.userAgent);
    console.log('API URL:', process.env.REACT_APP_API_URL);

    if (isLocked) {
      setError(`Account locked. Try again in ${lockTimeLeft} seconds.`);
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Calling login API...');
      await login(formData.email, formData.password);
      console.log('Login successful');
      navigate('/wallet');
    } catch (err) {
      console.error('Login error:', err);
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);

      if (attempts >= 5) {
        setIsLocked(true);
        setLockTimeLeft(300); // 5 minutes
        setError('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://proxyvanta-backend-1.onrender.com/api';
    const backendUrl = API_BASE_URL.replace('/api', '');
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 0, sm: 2 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        },
      }}
    >
      <Fade in={true} timeout={500}>
        <Card
          elevation={0}
          sx={{
            maxWidth: { xs: '100%', sm: 380, md: 400 },
            width: '100%',
            height: { xs: '100vh', sm: 'auto' },
            borderRadius: { xs: 0, sm: 2 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: { xs: 'none', sm: '0 8px 32px rgba(0,0,0,0.1)' },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
              p: { xs: 3, sm: 2 },
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3,
              },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '1.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              ProxyVanta
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: { xs: '0.9rem', sm: '0.8rem' },
                fontWeight: 500,
              }}
            >
              Secure Login Portal
            </Typography>
          </Box>

          <CardContent 
            sx={{ 
              p: { xs: 3, sm: 2.5 }, 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: { xs: 'auto', sm: 'visible' },
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.primary.main, 
                mb: { xs: 3, sm: 1.5 },
                fontSize: { xs: '1.25rem', sm: '1.125rem' },
              }}
            >
              Welcome Back
            </Typography>

            {error && (
              <Alert
                severity={isLocked ? "error" : "warning"}
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1rem'
                  }
                }}
                icon={isLocked ? <ErrorIcon /> : undefined}
              >
                {error}
              </Alert>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 1.5 },
              }}
            >
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="none"
                required
                disabled={isLocked}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="none"
                required
                disabled={isLocked}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="medium"
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} /> : <Visibility sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: { xs: '1rem', sm: '0.9rem' },
                    fontWeight: 500,
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      color="primary"
                      disabled={isLocked}
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '0.8rem' }, fontWeight: 500 }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => navigate('/forgot-password')}
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontSize: { xs: '0.9rem', sm: '0.8rem' },
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || isLocked}
                sx={{
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '1rem', sm: '0.9rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(26, 35, 126, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0d1b5e 0%, #283593 100%)',
                    boxShadow: '0 6px 20px rgba(26, 35, 126, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    color: theme.palette.grey[500],
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: { xs: 3, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 500 }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGoogleSignIn}
                disabled={isLocked}
                startIcon={<GoogleIcon />}
                sx={{
                  py: { xs: 1.5, sm: 1.2 },
                  fontSize: { xs: '1rem', sm: '0.9rem' },
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)',
                  backgroundSize: '200% 100%',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundPosition: '100% 0',
                    boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                Continue with Google
              </Button>

              <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 2 }, pb: { xs: 2, sm: 0 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '0.8rem' } }}>
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', sm: '0.8rem' },
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Login;