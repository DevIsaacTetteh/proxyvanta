import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(0);
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');

      if (!reference) {
        setVerificationStatus('error');
        setMessage('Payment reference not found');
        return;
      }

      try {
        const response = await api.get('/wallet/verify-payment', {
          params: { reference, trxref }
        });

        if (response.data.success) {
          setVerificationStatus('success');
          setMessage(response.data.message);
          setAmount(response.data.amount);

          // Start countdown for auto-redirect
          setRedirectCountdown(3);
          const countdownInterval = setInterval(() => {
            setRedirectCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/wallet');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setVerificationStatus('failed');
          setMessage(response.data.message);
        }
      } catch (error) {
        setVerificationStatus('error');
        const errorMessage = error.response?.data?.message || 'Payment verification failed';
        if (errorMessage.includes('Paystack') || errorMessage.includes('payment')) {
          setMessage('Payment system is currently being configured. Please contact support for assistance.');
        } else {
          setMessage(errorMessage);
        }
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />;
      case 'failed':
        return <CancelIcon sx={{ fontSize: 64, color: 'error.main' }} />;
      case 'error':
        return <CancelIcon sx={{ fontSize: 64, color: 'error.main' }} />;
      default:
        return <CircularProgress size={64} />;
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Card sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Status Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {getStatusIcon()}
            </Box>

            {/* Title */}
            <Typography variant="h4" component="h1" sx={{
              fontWeight: 'bold',
              color: '#333',
              mb: 2
            }}>
              Payment Verification
            </Typography>

            {/* Amount Display (only for successful payments) */}
            {verificationStatus === 'success' && amount > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" sx={{
                  fontWeight: 'bold',
                  color: 'success.main',
                  mb: 1
                }}>
                  ₵{amount.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Successfully added to your wallet
                </Typography>
              </Box>
            )}

            {/* Message */}
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              {message}
            </Typography>

            {/* Auto-redirect message for success */}
            {verificationStatus === 'success' && redirectCountdown !== null && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'success.contrastText', fontWeight: 'bold' }}>
                  Redirecting to wallet in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                </Typography>
              </Box>
            )}

            {/* Loading State */}
            {verificationStatus === 'loading' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Verifying your payment...
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/wallet')}
                sx={{
                  borderRadius: 2,
                  px: 3
                }}
              >
                Back to Wallet
              </Button>

              {verificationStatus === 'success' && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/purchase')}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    bgcolor: 'success.main',
                    '&:hover': {
                      bgcolor: 'success.dark'
                    }
                  }}
                >
                  Start Shopping
                </Button>
              )}
            </Box>

            {/* Additional Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> If you encountered any issues with your payment,
                please contact our support team for assistance.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PaymentVerification;