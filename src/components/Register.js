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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
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
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Zoom in={true} timeout={600}>
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
              Create Your Account
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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                margin="normal"
                required
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
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    fontSize: '0.9rem',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.9rem',
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
                margin="normal"
                required
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
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff sx={{ fontSize: '1.1rem' }} /> : <Visibility sx={{ fontSize: '1.1rem' }} />}
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

              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
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
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGoogleSignUp}
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
                }}
              >
                Continue with Google
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
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