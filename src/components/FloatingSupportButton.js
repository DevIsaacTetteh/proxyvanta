import React from 'react';
import {
  Fab,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
  Box
} from '@mui/material';
import {
  Support as SupportIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import SupportChat from './SupportChat';

const FloatingSupportButton = ({ open, onOpen, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="support"
        onClick={onOpen}
        sx={{
          position: 'fixed',
          bottom: {
            xs: 16,
            sm: 24,
            md: 32
          },
          right: {
            xs: 16,
            sm: 24,
            md: 32
          },
          zIndex: 1000,
          width: {
            xs: 56,
            sm: 64,
            md: 72
          },
          height: {
            xs: 56,
            sm: 64,
            md: 72
          },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          }
        }}
      >
        <SupportIcon sx={{
          fontSize: {
            xs: 24,
            sm: 28,
            md: 32
          }
        }} />
      </Fab>

      {/* Support Modal */}
      <Dialog
        fullWidth
        maxWidth={false}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 2 : 3,
            m: isMobile ? 1.5 : 2,
            maxHeight: isMobile ? '80vh' : '90vh',
            width: isMobile ? '92vw' : 'auto',
            overflow: 'hidden',
          }
        }}
      >
        {/* Close Button for Mobile */}
        {isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1100,
            }}
          >
            <IconButton
              onClick={onClose}
              sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,1)',
                  transform: 'scale(1.05)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        <DialogContent
          sx={{
            p: 0,
            height: 'auto',
            maxHeight: '80vh',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(102, 126, 234, 0.3)',
              borderRadius: '3px',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.5)',
              }
            }
          }}
        >
          <SupportChat onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingSupportButton;