"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users2, Settings, Mail, UserPlus, Trash2, Edit, Crown, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

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
          <Button variant="ghost" size="sm" disabled>
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
          <Button asChild variant="ghost" size="sm">
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
            <Button asChild>
              <Link href="/dashboard/teams">Back to Teams</Link>
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
          <Button asChild variant="ghost" size="sm">
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
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
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
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={updateTeam} disabled={editing}>
                      {editing ? 'Updating...' : 'Update Team'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Team</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this team? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={deleteTeam} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Team'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members ({team.members.length})</TabsTrigger>
          <TabsTrigger value="invitations">Invitations ({team.invitations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users2 className="h-5 w-5 mr-2" />
                  Team Info
                </CardTitle>
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
                      <AvatarImage src={team.owner.image || ''} />
                      <AvatarFallback className="text-xs">
                        {getInitials(team.owner.name || 'U')}
                      </AvatarFallback>
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
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isOwner && (
                  <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
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
                          <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
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
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href={`/dashboard/teams/${teamId}?tab=members`}>
                    <Users2 className="h-4 w-4 mr-2" />
                    View All Members
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Members</h3>
            {isOwner && (
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
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
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
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
                      <AvatarImage src={member.user?.image || ''} />
                      <AvatarFallback>
                        {getInitials(member.user?.name || 'U')}
                      </AvatarFallback>
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
                        variant="ghost"
                        size="sm"
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
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Invitations</h3>
            {isOwner && (
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Send Invitation
                  </Button>
                </DialogTrigger>
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
                      <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
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
                      return <Badge variant="default">Pending</Badge>;
                    case 'ACCEPTED':
                      return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
                    case 'DECLINED':
                      return <Badge variant="secondary" className="bg-red-100 text-red-800">Declined</Badge>;
                    case 'EXPIRED':
                      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Expired</Badge>;
                    case 'CANCELED':
                      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Canceled</Badge>;
                    default:
                      return <Badge variant="secondary">{status}</Badge>;
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
                              variant="ghost"
                              size="sm"
                              onClick={() => resendInvitation(invitation.id)}
                              disabled={resending === invitation.id}
                            >
                              {resending === invitation.id ? 'Resending...' : 'Resend'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 