import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Avatar,
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
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  PersonAdd,
  Shield,
  CheckCircle,
  Error as ErrorIcon,
  Info
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
      await register(formData.email, formData.password);
      setMessage('🎉 Registration successful! Welcome to ProxyVanta!');
      setTimeout(() => navigate('/wallet'), 3000);
    } catch (err) {
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
          top: '15%',
          left: '15%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(35px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(25px)',
        }}
      />

      <Zoom in={true} timeout={600}>
        <Card
          elevation={24}
          sx={{
            maxWidth: 520,
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
              <PersonAdd sx={{ fontSize: 30, color: 'white' }} />
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
              Join PIA S5 Control
            </Typography>
            <Chip
              label="CREATE ACCOUNT"
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
              sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}
            >
              Create Your Account
            </Typography>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary', mb: 3 }}
            >
              Get started with secure proxy management
            </Typography>

            {message && (
              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: theme.palette.success.main
                  }
                }}
                icon={<CheckCircle />}
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
                  '& .MuiAlert-icon': {
                    color: theme.palette.error.main
                  }
                }}
                icon={<ErrorIcon />}
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
                helperText="We'll send important updates to this email"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                margin="normal"
                required
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

              {formData.password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: `${getPasswordStrengthColor()}.main`,
                        fontWeight: 600
                      }}
                    >
                      {getPasswordStrengthText()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={getPasswordStrengthColor()}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  {passwordFeedback.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {passwordFeedback.map((feedback, index) => (
                        <Typography key={index} variant="caption" color="text.secondary" component="div">
                          • {feedback}
                        </Typography>
                      ))}
                    </Box>
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
                error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                helperText={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

              <Box sx={{ mt: 3, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      color="primary"
                      required
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" sx={{ color: theme.palette.primary.main }}>
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
                      required
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" sx={{ color: theme.palette.primary.main }}>
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
                disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy}
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
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <PersonAdd sx={{ ml: 1, fontSize: '1.2rem' }} />}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
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
                  Already have an account?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>

            {/* Security tips */}
            <Box sx={{ mt: 4, p: 2, background: 'rgba(26, 35, 126, 0.04)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 1 }}>
                🛡️ Account Security:
              </Typography>
              <Typography variant="caption" color="text.secondary" component="div">
                • Use a unique password for your account<br/>
                • Enable two-factor authentication when available<br/>
                • Never share your credentials with anyone<br/>
                • Regularly update your password
              </Typography>
            </Box>

            {/* Info box */}
            <Box sx={{ mt: 2, p: 2, background: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 152, 0, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Info sx={{ color: theme.palette.warning.main, mr: 1, mt: 0.5, fontSize: '1rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.warning.main, mb: 0.5 }}>
                    What happens next?
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    After registration, you'll receive a confirmation email. You can then fund your wallet and start purchasing proxies immediately.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default Register;