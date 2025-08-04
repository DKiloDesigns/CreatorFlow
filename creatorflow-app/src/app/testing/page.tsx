'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Database,
  Globe,
  Lock,
  Unlock,
  BarChart3,
  FileText,
  Download,
  Upload,
  Target,
  Bug,
  Code,
  Monitor,
  Smartphone,
  Server,
  Cpu,
  HardDrive,
  Network,
  DatabaseIcon,
  GlobeIcon,
  LockIcon,
  UnlockIcon,
  TrendingUpIcon,
  BarChart3Icon,
  FileTextIcon,
  DownloadIcon,
  UploadIcon,
  TargetIcon,
  BugIcon,
  CodeIcon,
  MonitorIcon,
  SmartphoneIcon,
  ServerIcon,
  CpuIcon,
  HardDriveIcon,
  NetworkIcon
} from 'lucide-react';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  tests: Test[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

interface Test {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  stackTrace?: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
  results: TestResult[];
}

interface TestResult {
  id: string;
  testId: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  stackTrace?: string;
  metadata: any;
  timestamp: Date;
}

interface TestMetrics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  successRate: number;
  averageDuration: number;
  totalDuration: number;
  lastRunTime?: Date;
}

export default function TestingPage() {
  const [suites, setSuites] = useState<TestSuite[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateSuite, setShowCreateSuite] = useState(false);
  const [newSuite, setNewSuite] = useState({
    name: '',
    description: '',
    category: 'unit' as const,
  });

  useEffect(() => {
    fetchTestingData();
  }, []);

  const fetchTestingData = async () => {
    try {
      setLoading(true);
      
      const [suitesRes, metricsRes] = await Promise.all([
        fetch('/api/testing'),
        fetch('/api/testing?type=metrics'),
      ]);

      if (suitesRes.ok) {
        const suitesData = await suitesRes.json();
        setSuites(suitesData.suites || []);
      }

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestSuite = async () => {
    try {
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_suite',
          data: newSuite,
        }),
      });

      if (response.ok) {
        await fetchTestingData();
        setShowCreateSuite(false);
        setNewSuite({ name: '', description: '', category: 'unit' });
      }
    } catch (error) {
      console.error('Failed to create test suite:', error);
    }
  };

  const runTestSuite = async (suiteId: string) => {
    try {
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_suite',
          data: { suiteId },
        }),
      });

      if (response.ok) {
        await fetchTestingData();
      }
    } catch (error) {
      console.error('Failed to run test suite:', error);
    }
  };

  const runContinuousTests = async () => {
    try {
      const response = await fetch('/api/testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_continuous',
          data: {},
        }),
      });

      if (response.ok) {
        await fetchTestingData();
      }
    } catch (error) {
      console.error('Failed to run continuous tests:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unit': return <Code className="h-4 w-4" />;
      case 'integration': return <Database className="h-4 w-4" />;
      case 'e2e': return <Monitor className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return <Code className="h-4 w-4" />;
      case 'integration': return <Database className="h-4 w-4" />;
      case 'e2e': return <Monitor className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  if (loading) return <div className="p-8">Loading testing data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TestTube className="h-8 w-8" />
            Testing & Quality Assurance
          </h1>
          <p className="text-muted-foreground">Comprehensive testing framework and quality assurance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runContinuousTests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run All Tests
          </Button>
          <Button onClick={() => setShowCreateSuite(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Test Suite
          </Button>
        </div>
      </div>

      {/* Testing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalTests || 0}</div>
            <p className="text-xs text-muted-foreground">
              All test cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {metrics?.passedTests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful tests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics?.successRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Test success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(metrics?.averageDuration || 0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Average test time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Test Categories
                </CardTitle>
                <CardDescription>
                  Distribution of test types and categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['unit', 'integration', 'e2e', 'performance', 'security'].map(category => {
                    const count = suites.flatMap(s => s.tests).filter(t => t.type === category).length;
                    const percentage = metrics?.totalTests ? (count / metrics.totalTests) * 100 : 0;
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          <span className="text-sm font-medium capitalize">{category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{count}</span>
                          <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Test Results
                </CardTitle>
                <CardDescription>
                  Latest test executions and outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suites.slice(0, 3).flatMap(suite => 
                    suite.tests.slice(0, 2).map(test => {
                      const latestResult = test.results[0];
                      return (
                        <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{test.name}</h3>
                            <p className="text-sm text-muted-foreground">{suite.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                              {latestResult && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(latestResult.timestamp).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(test.type)}
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Test Suites
              </CardTitle>
              <CardDescription>
                Manage and execute test suites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suites.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No test suites found. Create your first test suite to get started.</p>
                  </div>
                ) : (
                  suites.map((suite) => (
                    <div key={suite.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(suite.category)}
                            <h3 className="font-semibold">{suite.name}</h3>
                            <Badge className={getStatusColor(suite.status)}>
                              {suite.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{suite.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>{suite.tests.length} tests</span>
                            <span>Category: {suite.category}</span>
                            <span>Created {new Date(suite.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => runTestSuite(suite.id)}>
                            <Play className="h-3 w-3" />
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

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Test Results
              </CardTitle>
              <CardDescription>
                Detailed test execution results and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suites.flatMap(suite => 
                  suite.tests.flatMap(test => 
                    test.results.slice(0, 3).map(result => (
                      <div key={result.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{test.name}</h3>
                              <Badge className={getStatusColor(result.status)}>
                                {result.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{suite.name}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{result.duration}ms</span>
                              <span>{new Date(result.timestamp).toLocaleDateString()}</span>
                              {result.error && (
                                <span className="text-red-600">Error: {result.error}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Tests
              </CardTitle>
              <CardDescription>
                Performance testing results and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suites
                  .filter(suite => suite.category === 'performance')
                  .flatMap(suite => suite.tests)
                  .map(test => {
                    const latestResult = test.results[0];
                    return (
                      <div key={test.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{test.name}</h3>
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Response Time:</span>
                                <span>{latestResult?.duration || test.duration}ms</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Threshold:</span>
                                <span>{test.metadata?.threshold || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Tests
              </CardTitle>
              <CardDescription>
                Security testing results and vulnerability assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suites
                  .filter(suite => suite.category === 'security')
                  .flatMap(suite => suite.tests)
                  .map(test => {
                    const latestResult = test.results[0];
                    return (
                      <div key={test.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{test.name}</h3>
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Vulnerability:</span>
                                <span>{test.metadata?.vulnerability || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Severity:</span>
                                <span className={`font-semibold ${
                                  test.metadata?.severity === 'critical' ? 'text-red-600' :
                                  test.metadata?.severity === 'high' ? 'text-orange-600' :
                                  test.metadata?.severity === 'medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {test.metadata?.severity || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Shield className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Test Suite Modal */}
      {showCreateSuite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Test Suite</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Suite Name</label>
                <Input
                  value={newSuite.name}
                  onChange={(e) => setNewSuite({ ...newSuite, name: e.target.value })}
                  placeholder="Enter test suite name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newSuite.description}
                  onChange={(e) => setNewSuite({ ...newSuite, description: e.target.value })}
                  placeholder="Enter test suite description"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newSuite.category}
                  onValueChange={(value: 'unit' | 'integration' | 'e2e' | 'performance' | 'security') => 
                    setNewSuite({ ...newSuite, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">Unit Tests</SelectItem>
                    <SelectItem value="integration">Integration Tests</SelectItem>
                    <SelectItem value="e2e">End-to-End Tests</SelectItem>
                    <SelectItem value="performance">Performance Tests</SelectItem>
                    <SelectItem value="security">Security Tests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createTestSuite} disabled={!newSuite.name}>
                  Create Test Suite
                </Button>
                <Button variant="outline" onClick={() => setShowCreateSuite(false)}>
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