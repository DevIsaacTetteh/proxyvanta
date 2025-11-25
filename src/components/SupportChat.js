import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Avatar,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Fade,
  Slide,
  CircularProgress
} from '@mui/material';
import {
  Support as SupportIcon,
  Send as SendIcon,
  Add as AddIcon,
  Close as CloseIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Message as MessageIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import api from '../services/api';

const SupportChat = ({ onClose }) => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [newTicketData, setNewTicketData] = useState({
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({ open: 0, in_progress: 0, closed: 0 });
  const [filter, setFilter] = useState('all');

  const messagesEndRef = useRef(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/tickets');
      if (response.data.success) {
        setTickets(response.data.tickets);
        calculateStats(response.data.tickets);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const calculateStats = (ticketsList) => {
    const stats = { open: 0, in_progress: 0, closed: 0 };
    ticketsList.forEach(ticket => {
      if (stats[ticket.status] !== undefined) {
        stats[ticket.status]++;
      }
    });
    setStats(stats);
  };

  const loadMessages = async (ticketId) => {
    try {
      setLoading(true);
      const response = await api.get(`/support/tickets/${ticketId}/messages`);
      if (response.data.success) {
        setSelectedTicket(response.data.ticket);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketData.subject.trim() || !newTicketData.message.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/support/tickets', newTicketData);
      if (response.data.success) {
        setSuccess('Support ticket created successfully!');
        setNewTicketData({
          subject: '',
          message: '',
          category: 'general',
          priority: 'medium'
        });
        setShowNewTicketDialog(false);
        await loadTickets();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(error.response?.data?.message || 'Failed to create support ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setLoading(true);
    try {
      const response = await api.post(
        `/support/tickets/${selectedTicket._id || selectedTicket.id}/messages`,
        { message: newMessage }
      );
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
        setNewMessage('');
        await loadTickets(); // Refresh tickets to update last message time
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <PriorityHighIcon />;
      case 'in_progress': return <ScheduleIcon />;
      case 'closed': return <CheckCircleIcon />;
      default: return <HelpIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#d32f2f';
      case 'high': return '#f57c00';
      case 'medium': return '#1976d2';
      case 'low': return '#388e3c';
      default: return '#757575';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      sx={{
        minHeight: { xs: '50vh', sm: '58vh', md: '70vh' },
        maxHeight: { xs: '75vh', sm: '85vh', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'transparent',
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 1, sm: 1.5, md: 2.5 },
        boxSizing: 'border-box',
        overflowX: 'auto',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 1.5, sm: 2.5 },
          textAlign: 'center',
          pt: { xs: 0.25, sm: 1.25 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Support Center
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: '500px',
            mx: 'auto',
            fontSize: { xs: '0.78rem', sm: '0.85rem' }
          }}
        >
          Get help with your ProxyVanta account. Create support tickets or continue existing conversations.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid
        container
        spacing={1.5}
        sx={{ mb: { xs: 1.25, sm: 2.5 } }}
      >
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'error.main', mx: 'auto', mb: 0.5, width: 32, height: 32 }}>
                <PriorityHighIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', fontSize: '1.25rem' }}>
                {stats.open}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Open
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 0.5, width: 32, height: 32 }}>
                <ScheduleIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main', fontSize: '1.25rem' }}>
                {stats.in_progress}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 0.5, width: 32, height: 32 }}>
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', fontSize: '1.25rem' }}>
                {stats.closed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Resolved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 0.5, width: 32, height: 32 }}>
                <MessageIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.25rem' }}>
                {tickets.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Grid
        container
        spacing={2}
        sx={{ flex: 1, minHeight: 0, overflowX: 'auto', overflowY: 'auto' }}
      >
        {/* Tickets List */}
        <Grid
          item
          xs={12}
          md={selectedTicket ? 4 : 12}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: { xs: 260, sm: 280 },
              maxHeight: { xs: 360, sm: 420, md: '100%' }
            }}
          >
            <CardContent
              sx={{
                p: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Support Tickets
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowNewTicketDialog(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      py: 0.75,
                      px: 2,
                    }}
                  >
                    New Ticket
                  </Button>
                </Box>

                {/* Filter */}
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filter}
                    label="Filter by Status"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Tickets</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Tickets List */}
              <Box
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  maxHeight: { xs: 260, sm: 320, md: 400 }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredTickets.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <SupportIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {filter === 'all' ? 'No support tickets yet' : `No ${filter.replace('_', ' ')} tickets`}
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {filteredTickets.map((ticket, index) => (
                      <React.Fragment key={ticket._id}>
                        <ListItem
                          button
                          onClick={() => loadMessages(ticket._id)}
                          selected={selectedTicket?._id === ticket._id}
                          sx={{
                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.04)' },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(102, 126, 234, 0.08)',
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.12)' }
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: `${getStatusColor(ticket.status)}.main`, width: 36, height: 36 }}>
                              {getStatusIcon(ticket.status)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                  {ticket.subject}
                                </Typography>
                                <Chip
                                  label={ticket.priority}
                                  size="small"
                                  sx={{
                                    bgcolor: getPriorityColor(ticket.priority),
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    height: '18px'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {formatDate(ticket.lastMessage || ticket.createdAt)} • {ticket.category}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < filteredTickets.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Area */}
        {selectedTicket && (
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: { xs: 360, sm: 420, md: 560 },
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Chat Header */}
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {selectedTicket.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={selectedTicket.status.replace('_', ' ')}
                        size="small"
                        color={getStatusColor(selectedTicket.status)}
                        icon={getStatusIcon(selectedTicket.status)}
                      />
                      <Chip
                        label={selectedTicket.priority}
                        size="small"
                        sx={{
                          bgcolor: getPriorityColor(selectedTicket.priority),
                          color: 'white'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {selectedTicket.category}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={() => setSelectedTicket(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                {messages.map((message, index) => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      mb: 2,
                      justifyContent: message.is_admin ? 'flex-start' : 'flex-end'
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        borderRadius: message.is_admin ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                        bgcolor: message.is_admin ? 'grey.100' : 'primary.main',
                        color: message.is_admin ? 'text.primary' : 'white',
                      }}
                    >
                      <Typography variant="body2">{message.message}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          textAlign: message.is_admin ? 'left' : 'right'
                        }}
                      >
                        {formatDate(message.created_at)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              {selectedTicket.status !== 'closed' && (
                <Box sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={loading}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading}
                      sx={{ borderRadius: 3, px: 3 }}
                    >
                      {loading ? <CircularProgress size={20} /> : <SendIcon />}
                    </Button>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        )}
      </Grid>

      {/* New Ticket Dialog */}
      <Dialog
        open={showNewTicketDialog}
        onClose={() => setShowNewTicketDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create New Support Ticket
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            value={newTicketData.subject}
            onChange={(e) => setNewTicketData(prev => ({ ...prev, subject: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={newTicketData.message}
            onChange={(e) => setNewTicketData(prev => ({ ...prev, message: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newTicketData.category}
                  label="Category"
                  onChange={(e) => setNewTicketData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="billing">Billing</MenuItem>
                  <MenuItem value="account">Account</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicketData.priority}
                  label="Priority"
                  onChange={(e) => setNewTicketData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setShowNewTicketDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateTicket}
            variant="contained"
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupportChat;