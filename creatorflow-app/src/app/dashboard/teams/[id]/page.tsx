"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Users, Activity, Settings, Edit, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import { Textarea } from '@/components/ui/textarea';
import { Users2, UserPlus, Crown, Shield, Trash2, Mail, User } from 'lucide-react';

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
    status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'CANCELED';
    invitedByUser: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: string;
    expiresAt: string;
    respondedAt?: string;
  }>;
}

export default function TeamDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const { toast } = useToast();

  const teamId = params?.id as string;

  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
    if (teamId) {
      fetchTeam();
    }
  }, [teamId, searchParams]);

  const fetchTeam = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch team');
      }
      const data = await response.json();
      setTeam(data);
      setEditName(data.name);
      setEditDescription(data.description || '');
    } catch (error) {
      console.error('Error fetching team:', error);
      toast({
        title: "Error",
        description: "Failed to load team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeam = async () => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    setEditing(true);
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update team');
      }

      const updatedTeam = await response.json();
      setTeam(updatedTeam);
      setEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Team updated successfully",
      });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        title: "Error",
        description: "Failed to update team",
        variant: "destructive",
      });
    } finally {
      setEditing(false);
    }
  };

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return;
    }

    setInviting(true);
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      await fetchTeam(); // Refresh team data
      setInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('MEMBER');
      
      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setInviting(false);
    }
  };

  const deleteTeam = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      toast({
        title: "Success",
        description: "Team deleted successfully",
      });
      
      // Redirect to teams list
      window.location.href = '/dashboard/teams';
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      await fetchTeam(); // Refresh team data
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel invitation');
      }

      await fetchTeam(); // Refresh team data
      toast({
        title: "Success",
        description: "Invitation cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive",
      });
    }
  };

  const resendInvitation = async (invitationId: string) => {
    setResending(invitationId);
    try {
      const response = await fetch(`/api/teams/${teamId}/invitations/${invitationId}/resend`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to resend invitation');
      }

      await fetchTeam(); // Refresh team data
      toast({
        title: "Success",
        description: "Invitation resent successfully",
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to resend invitation",
        variant: "destructive",
      });
    } finally {
      setResending(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isOwner = team?.owner.id === session?.user?.id;
  const userRole = team?.members.find(m => m.user.id === session?.user?.id)?.role;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="text" size="small" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="text" size="small">
            <Link href="/dashboard/teams">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold mb-2">Team not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The team you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button component={Link} href="/dashboard/teams">
              Back to Teams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="text" size="small">
            <Link href="/dashboard/teams">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">{team.description || 'No description'}</p>
          </div>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
              <Button variant="outlined" onClick={() => setEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Team</DialogTitle>
                  <DialogDescription>
                    Update your team's name and description.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-team-name">Team Name</Label>
                    <Input
                      id="edit-team-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-team-description">Description</Label>
                    <Textarea
                      id="edit-team-description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Describe your team's purpose"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outlined" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={updateTeam} disabled={editing}>
                      {editing ? 'Updating...' : 'Update Team'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Team</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this team? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" onClick={deleteTeam} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Team'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Box>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} className="space-y-6">
          <Tab label="Overview" value="overview" />
          <Tab label={`Members (${team.members.length})`} value="members" />
          <Tab label={`Invitations (${team.invitations.length})`} value="invitations" />
        </Tabs>

        {activeTab === 'overview' && (
          <Box className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Typography variant="h6" className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2" />
                  Team Info
                </Typography>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Owner</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      {team.owner.image ? <img src={team.owner.image} alt={team.owner.name} className="w-full h-full object-cover" /> : team.owner.name?.charAt(0) || 'O'}
                    </Avatar>
                    <span className="text-sm">{team.owner.name}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Your Role</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {userRole === 'OWNER' ? (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    ) : userRole === 'ADMIN' ? (
                      <Shield className="h-4 w-4 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm capitalize">{userRole?.toLowerCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6" className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Quick Actions
                </Typography>
              </CardHeader>
              <CardContent className="space-y-3">
                {isOwner && (
                  <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                    <Button className="w-full justify-start" onClick={() => setInviteDialogOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join your team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invite-email">Email Address</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="invite-role">Role</Label>
                          <select
                            id="invite-role"
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outlined" onClick={() => setInviteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={sendInvitation} disabled={inviting}>
                            {inviting ? 'Sending...' : 'Send Invitation'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                <Button 
                  component={Link} 
                  href={`/dashboard/teams/${teamId}?tab=members`}
                  variant="outlined" 
                  className="w-full justify-start"
                >
                  <Users2 className="h-4 w-4 mr-2" />
                  View All Members
                </Button>
              </CardContent>
            </Card>
          </div>
          </Box>
        )}

        {activeTab === 'members' && (
          <Box className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Members</h3>
            {isOwner && (
              <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outlined" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendInvitation} disabled={inviting}>
                        {inviting ? 'Sending...' : 'Send Invitation'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid gap-4">
            {team.members.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      {member.user?.image ? <img src={member.user.image} alt={member.user.name} className="w-full h-full object-cover" /> : member.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={member.role === 'OWNER' ? 'default' : 'secondary'}>
                      {member.role === 'OWNER' && <Crown className="h-3 w-3 mr-1" />}
                      {member.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                      {member.role.toLowerCase()}
                    </Badge>
                    {isOwner && member.role !== 'OWNER' && (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => removeMember(member.user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </Box>
        )}

        {activeTab === 'invitations' && (
          <Box className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Invitations</h3>
            {isOwner && (
              <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
                <Button onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Role</Label>
                      <select
                        id="invite-role"
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outlined" onClick={() => setInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendInvitation} disabled={inviting}>
                        {inviting ? 'Sending...' : 'Send Invitation'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {team.invitations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Mail className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No invitations found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {team.invitations.map((invitation) => {
                const isExpired = new Date(invitation.expiresAt) < new Date();
                const status = isExpired && invitation.status === 'PENDING' ? 'EXPIRED' : invitation.status;
                
                const getStatusBadge = (status: string) => {
                  switch (status) {
                    case 'PENDING':
                      return <Badge variant="default" label="Pending" />;
                    case 'ACCEPTED':
                      return <Badge variant="secondary" className="bg-green-100 text-green-800" label="Accepted" />;
                    case 'DECLINED':
                      return <Badge variant="secondary" className="bg-red-100 text-red-800" label="Declined" />;
                    case 'EXPIRED':
                      return <Badge variant="secondary" className="bg-gray-100 text-gray-800" label="Expired" />;
                    case 'CANCELED':
                      return <Badge variant="secondary" className="bg-gray-100 text-gray-800" label="Canceled" />;
                    default:
                      return <Badge variant="secondary" label={status} />;
                  }
                };

                return (
                  <Card key={invitation.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{invitation.email}</p>
                          {getStatusBadge(status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Invited by {invitation.invitedByUser?.name || 'Unknown'} • {invitation.role.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sent: {new Date(invitation.createdAt).toLocaleDateString()} • 
                          Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                          {invitation.respondedAt && (
                            <span> • Responded: {new Date(invitation.respondedAt).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOwner && status === 'PENDING' && (
                          <>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => resendInvitation(invitation.id)}
                              disabled={resending === invitation.id}
                            >
                              {resending === invitation.id ? 'Resending...' : 'Resend'}
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => cancelInvitation(invitation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          </Box>
        )}
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </div>
  );
} 