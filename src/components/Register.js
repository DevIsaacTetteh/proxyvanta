import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
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
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  CheckCircle,
  Error as ErrorIcon,
  Google as GoogleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState([]);

  const { register } = useAuth();
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
      window.history.replaceState({}, document.title, '/register');
      return;
    }

    if (token) {
      // Store token and navigate to wallet
      localStorage.setItem('userToken', token);
      // Clean URL
      window.history.replaceState({}, document.title, '/register');
      navigate('/wallet');
    }
  }, [navigate]);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    const feedback = [];

    if (password.length >= 8) strength += 25;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) strength += 25;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) strength += 25;
    else feedback.push('One lowercase letter');

    if (/[0-9]/.test(password)) strength += 25;
    else feedback.push('One number');

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password') {
      calculatePasswordStrength(value);
    }

    if (error) setError('');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'error';
    if (passwordStrength < 50) return 'warning';
    if (passwordStrength < 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Register attempt on device:', navigator.userAgent);
    console.log('API URL:', process.env.REACT_APP_API_URL);
    setLoading(true);
    setError('');
    setMessage('');

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Password strength validation - require all criteria
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling register API...');
      await register(formData.email, formData.password);
      console.log('Register successful');
      setMessage('🎉 Registration successful! Welcome to ProxyVanta!');
      setTimeout(() => navigate('/wallet'), 3000);
    } catch (err) {
      console.error('Register error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleSignUp = () => {
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
      <Zoom in={true} timeout={600}>
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
              Create Your Account
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
              Join ProxyVanta
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1rem'
                  }
                }}
                icon={<ErrorIcon />}
              >
                {error}
              </Alert>
            )}

            {message && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  '& .MuiAlert-icon': {
                    fontSize: '1rem'
                  }
                }}
                icon={<CheckCircle />}
              >
                {message}
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ flex: 1, fontSize: '0.75rem' }}>
                      Password Strength:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: theme.palette[getPasswordStrengthColor()].main
                      }}
                    >
                      {getPasswordStrengthText()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette[getPasswordStrengthColor()].main,
                        borderRadius: 2,
                      },
                    }}
                  />
                  {passwordFeedback.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                      {passwordFeedback.join(', ')}
                    </Typography>
                  )}
                </Box>
              )}

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                margin="none"
                required
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
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="medium"
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} /> : <Visibility sx={{ fontSize: { xs: '1.25rem', sm: '1.1rem' } }} />}
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

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '0.8rem' }, fontWeight: 500 }}>
                      I accept the{' '}
                      <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                        Terms of Service
                      </Link>
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptPrivacy}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptPrivacy: e.target.checked }))}
                      color="primary"
                      size="medium"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '0.8rem' }, fontWeight: 500 }}>
                      I accept the{' '}
                      <Link href="#" sx={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ my: { xs: 3, sm: 2 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.75rem' }, fontWeight: 500 }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGoogleSignUp}
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
                }}
              >
                Continue with Google
              </Button>

              <Box sx={{ textAlign: 'center', mt: { xs: 3, sm: 2 }, pb: { xs: 2, sm: 0 } }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', sm: '0.8rem' } }}>
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
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
                    Sign in
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default Register;