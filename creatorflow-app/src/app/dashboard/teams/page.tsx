"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users2, Settings, Trash2, Mail, UserPlus } from 'lucide-react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Chip,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Container,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  members: Array<{
    id: string;
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: string;
    status: string;
  }>;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTeamName.trim(),
          description: newTeamDescription.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const newTeam = await response.json();
      setTeams(prev => [...prev, newTeam]);
      setCreateDialogOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
      
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const deleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      setTeams(prev => prev.filter(team => team.id !== teamId));
      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Teams
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your team collaborations and permissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus style={{ width: 16, height: 16 }} />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Team
          </Button>
        </Box>

        {/* Teams Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {teams.map((team) => (
            <Box key={team.id}>
              <Card>
                <CardHeader
                  title={team.name}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(team.name)}
                    </Avatar>
                  }
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Team Settings">
                        <IconButton size="small">
                          <Settings style={{ width: 16, height: 16 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Team">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => deleteTeam(team.id)}
                        >
                          <Trash2 style={{ width: 16, height: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                <CardContent>
                  {team.description && (
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {team.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Users2 style={{ width: 16, height: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {team.members.length} members
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Mail style={{ width: 16, height: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {team.invitations.length} pending invitations
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label="Owner" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    {team.members.length > 0 && (
                      <Chip 
                        label={`${team.members.length} members`} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={Link}
                      href={`/dashboard/teams/${team.id}`}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      View Team
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Empty State */}
        {teams.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Users2 style={{ width: 48, height: 48, color: 'text.secondary', margin: '0 auto 16px' }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No teams yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Create your first team to start collaborating with others
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus style={{ width: 16, height: 16 }} />}
                onClick={() => setCreateDialogOpen(true)}
              >
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Team Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                fullWidth
                required
                placeholder="Enter team name"
              />
              <TextField
                label="Description (Optional)"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Describe what this team is for"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={createTeam} 
              variant="contained"
              disabled={creating || !newTeamName.trim()}
            >
              {creating ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
} 