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
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={true} timeout={500}>
        <Card
          elevation={4}
          sx={{
            maxWidth: { xs: 340, sm: 380, md: 400 },
            width: '100%',
            borderRadius: 2,
            background: 'white',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 2,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              ProxyVanta
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.8rem',
              }}
            >
              Secure Login Portal
            </Typography>
          </Box>

          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              align="center"
              sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1.5 }}
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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
                disabled={isLocked}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" sx={{ fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
                disabled={isLocked}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" sx={{ fontSize: '1.1rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: '1.1rem' }} /> : <Visibility sx={{ fontSize: '1.1rem' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: { xs: 0.5, sm: 0 },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      color="primary"
                      disabled={isLocked}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
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
                    fontSize: '0.8rem',
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
                  mb: 2,
                  py: 1,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
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
                  mb: 2,
                  py: 1.2,
                  fontSize: '0.9rem',
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

              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.8rem',
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