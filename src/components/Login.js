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
  Fade,
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
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={true} timeout={500}>
        <Card
          elevation={8}
          sx={{
            maxWidth: 400,
            width: '100%',
            borderRadius: 3,
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

          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
              sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mb: 2 }}
            >
              Sign in to access your proxy dashboard
            </Typography>

            {error && (
              <Alert
                severity={isLocked ? "error" : "warning"}
                sx={{
                  mb: 2,
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
                  mt: 1,
                  mb: 2,
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
                  mt: 1,
                  mb: 2,
                  py: 1.25,
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

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                disabled={isLocked}
                sx={{
                  mb: 2,
                  py: 1.25,
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
            <Box sx={{ textAlign: 'center', mt: 1 }}>
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
            <Box sx={{ mt: 2, p: 1.5, background: 'rgba(26, 35, 126, 0.04)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 0.5 }}>
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
      </Fade>
    </Box>
  );
};

export default Login;