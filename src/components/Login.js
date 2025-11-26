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
  Zoom,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Chip,
  Box
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  VpnKey,
  Shield,
  CheckCircle,
  Error as ErrorIcon
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        }
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(30px)',
        }}
      />

      <Zoom in={true} timeout={600}>
        <Card
          elevation={24}
          sx={{
            maxWidth: 480,
            width: '100%',
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Header with branding */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5e35b1 100%)',
              p: 3,
              textAlign: 'center',
              borderRadius: '4px 4px 0 0',
              position: 'relative',
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <VpnKey sx={{ fontSize: 30, color: 'white' }} />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              PROXYVANTA
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
              }}
            >
              PIA S5 Control
            </Typography>
            <Chip
              label="SECURE LOGIN"
              sx={{
                mt: 2,
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
              icon={<Shield sx={{ color: 'white !important' }} />}
            />
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 3 }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mb: 3 }}
            >
              Sign in to access your proxy dashboard
            </Typography>

            {error && (
              <Alert
                severity={isLocked ? "error" : "warning"}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: isLocked ? theme.palette.error.main : theme.palette.warning.main
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      color="primary"
                      disabled={isLocked}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
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
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                  boxShadow: '0 4px 15px rgba(26, 35, 126, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3949ab 0%, #5e35b1 100%)',
                    boxShadow: '0 6px 20px rgba(26, 35, 126, 0.4)',
                  },
                  '&:disabled': {
                    background: theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
                {!loading && <CheckCircle sx={{ ml: 1, fontSize: '1.2rem' }} />}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                disabled={isLocked}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.text.secondary,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: 'rgba(26, 35, 126, 0.04)',
                  },
                }}
              >
                Continue with Google (Coming Soon)
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/register')}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: 'inherit',
                      textTransform: 'none',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    Create one now
                  </Button>
                </Typography>
              </Box>
            </Box>

            {/* Forgot Password */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="text"
                onClick={() => navigate('/forgot-password')}
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Forgot your password?
              </Button>
            </Box>

            {/* Security tips */}
            <Box sx={{ mt: 4, p: 2, background: 'rgba(26, 35, 126, 0.04)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1 }}>
                🔒 Security Tips:
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                • Never share your login credentials<br/>
                • Use a strong, unique password<br/>
                • Enable two-factor authentication when available<br/>
                • Log out after each session on public devices
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default Login;