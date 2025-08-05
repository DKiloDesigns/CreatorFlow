"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Container,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Building,
  TrendingUp,
  FileText,
  Link,
  ExternalLink
} from 'lucide-react';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function CollabsPage() {
  const [collabs, setCollabs] = useState<any>(null);
  const [collabsError, setCollabsError] = useState<any>(null);
  const [collabsLoading, setCollabsLoading] = useState<boolean>(true);
  
  const [report, setReport] = useState<any>(null);
  const [reportError, setReportError] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(true);
  
  const firstCollabId = collabs && collabs.length > 0 ? collabs[0].id : null;
  const [selectedCollabId, setSelectedCollabId] = React.useState(firstCollabId);
  
  // Modal state
  const [showCreate, setShowCreate] = React.useState(false);
  const [showUpdate, setShowUpdate] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', brandName: '', startDate: '', endDate: '' });
  const [loading, setLoading] = React.useState(false);
  
  // Equivalent to mutate function
  const mutate = async () => {
    setCollabsLoading(true);
    try {
      const data = await fetcher('/api/collabs');
      setCollabs(data);
    } catch (err) {
      setCollabsError(err);
    } finally {
      setCollabsLoading(false);
    }
  };
  
  // Equivalent to mutateReport function
  const mutateReport = async () => {
    if (!selectedCollabId) return;
    setReportLoading(true);
    try {
      const data = await fetcher(`/api/collabs/${selectedCollabId}/report`);
      setReport(data);
    } catch (err) {
      setReportError(err);
    } finally {
      setReportLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    mutate();
  }, []);
  
  // Update selectedCollabId when firstCollabId changes
  React.useEffect(() => { 
    setSelectedCollabId(firstCollabId); 
  }, [firstCollabId]);
  
  // Fetch report when selectedCollabId changes
  useEffect(() => {
    if (selectedCollabId) {
      mutateReport();
    }
  }, [selectedCollabId]);

  const handleCreate = async () => {
    if (!form.name || !form.brandName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/collabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to create collaboration');

      await mutate();
      setShowCreate(false);
      setForm({ name: '', brandName: '', startDate: '', endDate: '' });
      toast.success('Collaboration created successfully');
    } catch (error) {
      toast.error('Failed to create collaboration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCollabId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/collabs/${selectedCollabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to update collaboration');

      await mutate();
      setShowUpdate(false);
      setForm({ name: '', brandName: '', startDate: '', endDate: '' });
      toast.success('Collaboration updated successfully');
    } catch (error) {
      toast.error('Failed to update collaboration');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCollabId) return;

    if (!confirm('Are you sure you want to delete this collaboration?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/collabs/${selectedCollabId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete collaboration');

      await mutate();
      toast.success('Collaboration deleted successfully');
    } catch (error) {
      toast.error('Failed to delete collaboration');
    } finally {
      setLoading(false);
    }
  };

  if (collabsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (collabsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Failed to load collaborations
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Collaborations
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your brand partnerships and collaborations
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus style={{ width: 16, height: 16 }} />}
            onClick={() => setShowCreate(true)}
          >
            New Collaboration
          </Button>
        </Box>

        {/* Collaborations List */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {collabs && collabs.length > 0 ? (
            collabs.map((collab: any) => (
              <Box key={collab.id}>
                <Card>
                  <CardHeader
                    title={collab.name}
                    titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Building style={{ width: 20, height: 20 }} />
                      </Avatar>
                    }
                    action={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setForm({
                                name: collab.name,
                                brandName: collab.brandName,
                                startDate: collab.startDate,
                                endDate: collab.endDate
                              });
                              setSelectedCollabId(collab.id);
                              setShowUpdate(true);
                            }}
                          >
                            <Edit style={{ width: 16, height: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={handleDelete}
                          >
                            <Trash2 style={{ width: 16, height: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Building style={{ width: 16, height: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {collab.brandName}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Calendar style={{ width: 16, height: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {collab.startDate} - {collab.endDate}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={collab.status || 'Active'} 
                        color={collab.status === 'Active' ? 'success' : 'default'}
                        size="small"
                      />
                      {collab.type && (
                        <Chip 
                          label={collab.type} 
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        startIcon={<TrendingUp style={{ width: 16, height: 16 }} />}
                        onClick={() => setSelectedCollabId(collab.id)}
                      >
                        View Report
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))
          ) : (
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Users style={{ width: 48, height: 48, color: 'text.secondary', margin: '0 auto 16px' }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No collaborations yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    Create your first collaboration to start tracking brand partnerships
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus style={{ width: 16, height: 16 }} />}
                    onClick={() => setShowCreate(true)}
                  >
                    Create Collaboration
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Report Section */}
        {selectedCollabId && report && (
          <Card>
            <CardHeader
              title="Collaboration Report"
              titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              avatar={<TrendingUp style={{ width: 24, height: 24, color: '#10b981' }} />}
            />
            <CardContent>
              {reportLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : reportError ? (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  Failed to load report
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {report.totalPosts || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Posts
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {report.totalEngagement || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Engagement
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {report.totalReach || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Reach
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Collaboration Dialog */}
        <Dialog open={showCreate} onClose={() => setShowCreate(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Collaboration</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Collaboration Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Brand Name"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              variant="contained"
              disabled={loading || !form.name || !form.brandName}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Update Collaboration Dialog */}
        <Dialog open={showUpdate} onClose={() => setShowUpdate(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Collaboration</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Collaboration Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Brand Name"
                value={form.brandName}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowUpdate(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained"
              disabled={loading || !form.name || !form.brandName}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 