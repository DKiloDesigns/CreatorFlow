'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { 
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  Shield,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users2,
  FolderOpen,
  MessageSquare,
  Zap,
  Building2,
  Activity
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: any;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
  user: any;
}

interface ApprovalRequest {
  id: string;
  workflowId: string;
  requesterId: string;
  contentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
  workflow: {
    name: string;
    steps: any[];
  };
  approvals: any[];
}

interface TeamAnalytics {
  memberCount: number;
  activeProjects: number;
  totalContent: number;
  approvalRate: number;
  averageResponseTime: number;
}

export default function EnterprisePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchEnterpriseData();
  }, []);

  const fetchEnterpriseData = async () => {
    try {
      setLoading(true);
      
      const [teamsRes, approvalsRes] = await Promise.all([
        fetch('/api/enterprise/teams'),
        fetch('/api/enterprise/approvals'),
      ]);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData.teams || []);
      }

      if (approvalsRes.ok) {
        const approvalsData = await approvalsRes.json();
        setApprovals(approvalsData.requests || []);
      }

      // Mock analytics for now
      setAnalytics({
        memberCount: 12,
        activeProjects: 8,
        totalContent: 156,
        approvalRate: 87.5,
        averageResponseTime: 2.3,
      });
    } catch (error) {
      console.error('Failed to fetch enterprise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    try {
      const response = await fetch('/api/enterprise/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam),
      });

      if (response.ok) {
        await fetchEnterpriseData();
        setShowCreateTeam(false);
        setNewTeam({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'editor': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8">Loading enterprise data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Enterprise
          </h1>
          <p className="text-muted-foreground">Team collaboration and enterprise features</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateTeam(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </div>

      {/* Enterprise Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              Active teams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics?.memberCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {approvals.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics?.approvalRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Teams
                </CardTitle>
                <CardDescription>
                  Your most recently active teams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.slice(0, 3).map((team) => (
                    <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{team.members.length} members</Badge>
                          <Badge className={getRoleColor(team.members.find(m => m.role === 'owner')?.role || '')}>
                            {team.members.find(m => m.role === 'owner')?.role || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recent Approvals
                </CardTitle>
                <CardDescription>
                  Latest approval requests and decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {approvals.slice(0, 3).map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{approval.workflow.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Step {approval.currentStep} of {approval.workflow.steps.length}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(approval.status)}>
                            {approval.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(approval.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Teams
              </CardTitle>
              <CardDescription>
                Manage your teams and team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No teams found. Create your first team to get started.</p>
                  </div>
                ) : (
                  teams.map((team) => (
                    <div key={team.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{team.name}</h3>
                            <Badge className={getRoleColor(team.members.find(m => m.role === 'owner')?.role || '')}>
                              {team.members.find(m => m.role === 'owner')?.role || 'Unknown'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{team.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{team.members.length} members</span>
                            <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <UserPlus className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Approval Requests
              </CardTitle>
              <CardDescription>
                Review and manage content approval requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No approval requests found.</p>
                  </div>
                ) : (
                  approvals.map((approval) => (
                    <div key={approval.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{approval.workflow.name}</h3>
                            <Badge className={getStatusColor(approval.status)}>
                              {approval.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Step {approval.currentStep} of {approval.workflow.steps.length}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Requested {new Date(approval.createdAt).toLocaleDateString()}</span>
                            <span>{approval.approvals.length} approvals</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {approval.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <AlertTriangle className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Team Performance
                </CardTitle>
                <CardDescription>
                  Key metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Projects</span>
                    <span className="font-semibold">{analytics?.activeProjects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Content</span>
                    <span className="font-semibold">{analytics?.totalContent || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approval Rate</span>
                    <span className="font-semibold text-green-600">{analytics?.approvalRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Response Time</span>
                    <span className="font-semibold">{analytics?.averageResponseTime || 0}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Trends
                </CardTitle>
                <CardDescription>
                  Recent activity and engagement trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Members</span>
                    <span className="font-semibold text-blue-600">+3 this week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Created</span>
                    <span className="font-semibold text-green-600">+12 this week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approvals Processed</span>
                    <span className="font-semibold text-purple-600">+8 this week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Team Engagement</span>
                    <span className="font-semibold text-orange-600">+15% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  placeholder="Enter team description"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createTeam} disabled={!newTeam.name}>
                  Create Team
                </Button>
                <Button variant="outline" onClick={() => setShowCreateTeam(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 