/**
 * Enterprise Security & Compliance Engine
 * Advanced security features and compliance management
 */

export interface EnterpriseSecurity {
  organizationId: string;
  settings: SecuritySettings;
  policies: SecurityPolicy[];
  compliance: ComplianceFramework[];
  incidents: SecurityIncident[];
  auditLog: SecurityAuditLog[];
  users: SecurityUser[];
  devices: SecurityDevice[];
  integrations: SecurityIntegration[];
}

export interface SecuritySettings {
  authentication: {
    require2FA: boolean;
    allowSSO: boolean;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
    passwordPolicy: PasswordPolicy;
    mfaMethods: string[];
  };
  authorization: {
    rbacEnabled: boolean;
    attributeBasedAccess: boolean;
    dynamicPermissions: boolean;
    resourceBasedAccess: boolean;
  };
  encryption: {
    dataAtRest: boolean;
    dataInTransit: boolean;
    keyManagement: string;
    algorithm: string;
    keyRotation: number; // days
  };
  network: {
    ipWhitelist: string[];
    vpnRequired: boolean;
    geoRestrictions: string[];
    allowTor: boolean;
  };
  monitoring: {
    realTimeAlerts: boolean;
    anomalyDetection: boolean;
    threatIntelligence: boolean;
    logRetention: number; // days
  };
  backup: {
    enabled: boolean;
    frequency: string;
    retention: number; // days
    encryption: boolean;
    offsite: boolean;
  };
}

export interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'access' | 'data' | 'network' | 'incident' | 'compliance';
  rules: PolicyRule[];
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  effect: 'allow' | 'deny';
  conditions: PolicyCondition[];
  exceptions: PolicyException[];
}

export interface PolicyCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'regex' | 'greater_than' | 'less_than';
  value: any;
  description: string;
}

export interface PolicyException {
  id: string;
  name: string;
  description: string;
  conditions: PolicyCondition[];
  reason: string;
  approvedBy: string;
  expiresAt?: string;
}

export interface PolicyAction {
  type: 'log' | 'alert' | 'block' | 'allow' | 'require_approval' | 'notify';
  parameters: Record<string, any>;
  description: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  standard: 'SOC2' | 'ISO27001' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'CCPA' | 'SOX' | 'NIST';
  version: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_assessed';
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  assessments: ComplianceAssessment[];
  lastAssessment: string;
  nextAssessment: string;
  score: number; // percentage
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_assessed';
  evidence: ComplianceEvidence[];
  lastReviewed: string;
  reviewedBy: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  requirementId: string;
  type: 'preventive' | 'detective' | 'corrective';
  implementation: string;
  testing: string;
  frequency: string;
  owner: string;
  status: 'implemented' | 'not_implemented' | 'in_progress';
}

export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'screenshot' | 'log' | 'test_result' | 'interview';
  title: string;
  description: string;
  fileUrl?: string;
  content?: string;
  collectedAt: string;
  collectedBy: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ComplianceAssessment {
  id: string;
  frameworkId: string;
  type: 'internal' | 'external' | 'self';
  assessor: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  findings: ComplianceFinding[];
  score: number;
  report: string;
  recommendations: string[];
}

export interface ComplianceFinding {
  id: string;
  requirementId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string[];
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  assignedTo: string;
  dueDate: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  category: 'data_breach' | 'unauthorized_access' | 'malware' | 'phishing' | 'insider_threat' | 'system_compromise' | 'other';
  affectedResources: string[];
  affectedUsers: string[];
  detectedAt: string;
  reportedBy: string;
  assignedTo: string;
  timeline: IncidentTimeline[];
  evidence: IncidentEvidence[];
  actions: IncidentAction[];
  lessons: string[];
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface IncidentTimeline {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  actor: string;
  evidence?: string[];
}

export interface IncidentEvidence {
  id: string;
  type: 'log' | 'screenshot' | 'file' | 'network_capture' | 'memory_dump' | 'other';
  title: string;
  description: string;
  fileUrl?: string;
  collectedAt: string;
  collectedBy: string;
  chainOfCustody: string[];
}

export interface IncidentAction {
  id: string;
  type: 'containment' | 'eradication' | 'recovery' | 'notification' | 'investigation';
  description: string;
  takenBy: string;
  takenAt: string;
  status: 'planned' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  risk: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  organizationId: string;
  teamId?: string;
}

export interface SecurityUser {
  id: string;
  userId: string;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended' | 'locked';
  lastLogin?: string;
  lastPasswordChange: string;
  mfaEnabled: boolean;
  mfaMethods: string[];
  riskScore: number;
  anomalies: SecurityAnomaly[];
  permissions: string[];
  devices: string[];
  sessions: SecuritySession[];
}

export interface SecurityAnomaly {
  id: string;
  type: 'unusual_login_time' | 'unusual_location' | 'unusual_device' | 'multiple_failed_logins' | 'privilege_escalation' | 'data_access_pattern';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  details: Record<string, any>;
}

export interface SecuritySession {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  startedAt: string;
  lastActivity: string;
  expiresAt: string;
  isActive: boolean;
  riskScore: number;
}

export interface SecurityDevice {
  id: string;
  userId: string;
  name: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'tablet' | 'other';
  os: string;
  browser?: string;
  fingerprint: string;
  isTrusted: boolean;
  lastSeen: string;
  riskScore: number;
  anomalies: SecurityAnomaly[];
}

export interface SecurityIntegration {
  id: string;
  name: string;
  type: 'siem' | 'edr' | 'firewall' | 'vpn' | 'iam' | 'backup' | 'monitoring';
  provider: string;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  configuration: Record<string, any>;
  lastSync: string;
  health: {
    status: 'healthy' | 'warning' | 'critical';
    lastCheck: string;
    issues: string[];
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxAge: number; // days
  preventReuse: number; // number of previous passwords
  lockoutAttempts: number;
  lockoutDuration: number; // minutes
  complexity: 'low' | 'medium' | 'high' | 'very_high';
}

export interface ThreatIntelligence {
  id: string;
  type: 'ip' | 'domain' | 'email' | 'file_hash' | 'url';
  value: string;
  threatType: 'malware' | 'phishing' | 'botnet' | 'c2' | 'spam' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  source: string;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
  description: string;
}

export class EnterpriseSecurityEngine {
  private security: Map<string, EnterpriseSecurity> = new Map();
  private policies: Map<string, SecurityPolicy> = new Map();
  private incidents: Map<string, SecurityIncident> = new Map();
  private auditLog: SecurityAuditLog[] = [];
  private threatIntelligence: Map<string, ThreatIntelligence> = new Map();

  constructor() {
    this.initializeDefaultPolicies();
  }

  // Security Settings Management
  async createSecurityConfig(
    organizationId: string,
    settings: Partial<SecuritySettings>
  ): Promise<EnterpriseSecurity> {
    const security: EnterpriseSecurity = {
      organizationId,
      settings: {
        authentication: {
          require2FA: true,
          allowSSO: true,
          sessionTimeout: 480, // 8 hours
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          passwordPolicy: this.getDefaultPasswordPolicy(),
          mfaMethods: ['totp', 'sms', 'email']
        },
        authorization: {
          rbacEnabled: true,
          attributeBasedAccess: false,
          dynamicPermissions: false,
          resourceBasedAccess: true
        },
        encryption: {
          dataAtRest: true,
          dataInTransit: true,
          keyManagement: 'aws_kms',
          algorithm: 'AES-256',
          keyRotation: 90
        },
        network: {
          ipWhitelist: [],
          vpnRequired: false,
          geoRestrictions: [],
          allowTor: false
        },
        monitoring: {
          realTimeAlerts: true,
          anomalyDetection: true,
          threatIntelligence: true,
          logRetention: 2555 // 7 years
        },
        backup: {
          enabled: true,
          frequency: 'daily',
          retention: 2555, // 7 years
          encryption: true,
          offsite: true
        },
        ...settings
      },
      policies: [],
      compliance: [],
      incidents: [],
      auditLog: [],
      users: [],
      devices: [],
      integrations: []
    };

    this.security.set(organizationId, security);
    return security;
  }

  async updateSecuritySettings(
    organizationId: string,
    settings: Partial<SecuritySettings>
  ): Promise<SecuritySettings> {
    const security = this.security.get(organizationId);
    if (!security) {
      throw new Error('Security configuration not found');
    }

    security.settings = {
      ...security.settings,
      ...settings
    };

    this.security.set(organizationId, security);
    return security.settings;
  }

  // Policy Management
  async createSecurityPolicy(
    organizationId: string,
    policy: Omit<SecurityPolicy, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SecurityPolicy> {
    const policyId = `policy_${Date.now()}`;
    
    const newPolicy: SecurityPolicy = {
      ...policy,
      id: policyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.policies.set(policyId, newPolicy);
    
    const security = this.security.get(organizationId);
    if (security) {
      security.policies.push(newPolicy);
      this.security.set(organizationId, security);
    }

    return newPolicy;
  }

  async evaluatePolicy(
    organizationId: string,
    userId: string,
    action: string,
    resource: string,
    context: Record<string, any>
  ): Promise<{
    allowed: boolean;
    policyId?: string;
    reason?: string;
    actions: PolicyAction[];
  }> {
    const security = this.security.get(organizationId);
    if (!security) {
      return { allowed: false, reason: 'No security configuration found', actions: [] };
    }

    const applicablePolicies = security.policies.filter(p => 
      p.isActive && 
      p.rules.some(rule => 
        rule.resource === resource && 
        rule.action === action
      )
    );

    for (const policy of applicablePolicies) {
      for (const rule of policy.rules) {
        if (rule.resource === resource && rule.action === action) {
          const conditionsMet = this.evaluateConditions(rule.conditions, context);
          if (conditionsMet) {
            return {
              allowed: rule.effect === 'allow',
              policyId: policy.id,
              reason: rule.description,
              actions: rule.effect === 'allow' ? [] : policy.actions
            };
          }
        }
      }
    }

    // Default deny
    return { allowed: false, reason: 'No matching policy found', actions: [] };
  }

  // Compliance Management
  async createComplianceFramework(
    organizationId: string,
    standard: ComplianceFramework['standard'],
    version: string
  ): Promise<ComplianceFramework> {
    const frameworkId = `framework_${Date.now()}`;
    
    const framework: ComplianceFramework = {
      id: frameworkId,
      name: `${standard} ${version}`,
      description: `Compliance framework for ${standard} ${version}`,
      standard,
      version,
      status: 'not_assessed',
      requirements: this.getComplianceRequirements(standard, version),
      controls: this.getComplianceControls(standard, version),
      assessments: [],
      lastAssessment: '',
      nextAssessment: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      score: 0
    };

    const security = this.security.get(organizationId);
    if (security) {
      security.compliance.push(framework);
      this.security.set(organizationId, security);
    }

    return framework;
  }

  async assessCompliance(
    organizationId: string,
    frameworkId: string,
    assessor: string,
    type: ComplianceAssessment['type']
  ): Promise<ComplianceAssessment> {
    const assessmentId = `assessment_${Date.now()}`;
    
    const assessment: ComplianceAssessment = {
      id: assessmentId,
      frameworkId,
      type,
      assessor,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress',
      findings: [],
      score: 0,
      report: '',
      recommendations: []
    };

    const security = this.security.get(organizationId);
    if (security) {
      const framework = security.compliance.find(f => f.id === frameworkId);
      if (framework) {
        framework.assessments.push(assessment);
        this.security.set(organizationId, security);
      }
    }

    return assessment;
  }

  // Incident Management
  async createSecurityIncident(
    organizationId: string,
    incident: Omit<SecurityIncident, 'id' | 'detectedAt' | 'timeline' | 'evidence' | 'actions' | 'lessons'>
  ): Promise<SecurityIncident> {
    const incidentId = `incident_${Date.now()}`;
    
    const newIncident: SecurityIncident = {
      ...incident,
      id: incidentId,
      detectedAt: new Date().toISOString(),
      timeline: [],
      evidence: [],
      actions: [],
      lessons: []
    };

    this.incidents.set(incidentId, newIncident);
    
    const security = this.security.get(organizationId);
    if (security) {
      security.incidents.push(newIncident);
      this.security.set(organizationId, security);
    }

    return newIncident;
  }

  async updateIncidentStatus(
    incidentId: string,
    status: SecurityIncident['status'],
    updatedBy: string
  ): Promise<SecurityIncident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date().toISOString();
      incident.resolvedBy = updatedBy;
    }

    this.incidents.set(incidentId, incident);
    return incident;
  }

  async addIncidentTimeline(
    incidentId: string,
    event: string,
    description: string,
    actor: string,
    evidence?: string[]
  ): Promise<string> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    const timelineId = `timeline_${Date.now()}`;
    const timelineEntry: IncidentTimeline = {
      id: timelineId,
      timestamp: new Date().toISOString(),
      event,
      description,
      actor,
      evidence
    };

    incident.timeline.push(timelineEntry);
    this.incidents.set(incidentId, incident);
    
    return timelineId;
  }

  // Audit Logging
  async logSecurityEvent(
    organizationId: string,
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details: Record<string, any>,
    risk: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ): Promise<void> {
    const logEntry: SecurityAuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      resource,
      resourceId,
      ipAddress: details.ipAddress || '127.0.0.1',
      userAgent: details.userAgent || 'CreatorFlow/1.0',
      location: details.location,
      risk,
      details,
      organizationId
    };

    this.auditLog.push(logEntry);
  }

  async getSecurityAuditLog(
    organizationId: string,
    filters?: {
      userId?: string;
      action?: string;
      resource?: string;
      risk?: string;
      dateRange?: { start: string; end: string };
      limit?: number;
    }
  ): Promise<SecurityAuditLog[]> {
    let entries = this.auditLog.filter(entry => entry.organizationId === organizationId);

    if (filters) {
      if (filters.userId) {
        entries = entries.filter(entry => entry.userId === filters.userId);
      }
      if (filters.action) {
        entries = entries.filter(entry => entry.action === filters.action);
      }
      if (filters.resource) {
        entries = entries.filter(entry => entry.resource === filters.resource);
      }
      if (filters.risk) {
        entries = entries.filter(entry => entry.risk === filters.risk);
      }
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        entries = entries.filter(entry => {
          const timestamp = new Date(entry.timestamp);
          return timestamp >= startDate && timestamp <= endDate;
        });
      }
      if (filters.limit) {
        entries = entries.slice(0, filters.limit);
      }
    }

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Threat Intelligence
  async addThreatIntelligence(
    threat: Omit<ThreatIntelligence, 'id' | 'firstSeen' | 'lastSeen'>
  ): Promise<ThreatIntelligence> {
    const threatId = `threat_${Date.now()}`;
    const now = new Date().toISOString();
    
    const newThreat: ThreatIntelligence = {
      ...threat,
      id: threatId,
      firstSeen: now,
      lastSeen: now
    };

    this.threatIntelligence.set(threatId, newThreat);
    return newThreat;
  }

  async checkThreatIntelligence(
    type: ThreatIntelligence['type'],
    value: string
  ): Promise<ThreatIntelligence[]> {
    return Array.from(this.threatIntelligence.values())
      .filter(threat => threat.type === type && threat.value === value);
  }

  // Risk Assessment
  async calculateRiskScore(
    organizationId: string,
    userId: string,
    context: Record<string, any>
  ): Promise<number> {
    let riskScore = 0;

    // Base risk factors
    if (context.isNewDevice) riskScore += 20;
    if (context.isUnusualTime) riskScore += 15;
    if (context.isUnusualLocation) riskScore += 25;
    if (context.hasFailedLogins) riskScore += 30;
    if (context.isPrivilegedAction) riskScore += 10;

    // Threat intelligence check
    const threats = await this.checkThreatIntelligence('ip', context.ipAddress || '');
    if (threats.length > 0) {
      riskScore += Math.max(...threats.map(t => t.severity === 'critical' ? 50 : t.severity === 'high' ? 30 : 20));
    }

    return Math.min(riskScore, 100);
  }

  // Private helper methods
  private getDefaultPasswordPolicy(): PasswordPolicy {
    return {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      maxAge: 90,
      preventReuse: 12,
      lockoutAttempts: 5,
      lockoutDuration: 30,
      complexity: 'high'
    };
  }

  private evaluateConditions(
    conditions: PolicyCondition[],
    context: Record<string, any>
  ): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getNestedValue(context, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'not_equals':
          return fieldValue !== condition.value;
        case 'contains':
          return String(fieldValue).includes(String(condition.value));
        case 'not_contains':
          return !String(fieldValue).includes(String(condition.value));
        case 'in':
          return Array.isArray(condition.value) && condition.value.includes(fieldValue);
        case 'not_in':
          return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
        case 'regex':
          return new RegExp(condition.value).test(String(fieldValue));
        case 'greater_than':
          return Number(fieldValue) > Number(condition.value);
        case 'less_than':
          return Number(fieldValue) < Number(condition.value);
        default:
          return false;
      }
    });
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private getComplianceRequirements(
    standard: ComplianceFramework['standard'],
    version: string
  ): ComplianceRequirement[] {
    // Mock compliance requirements - in real implementation, this would load from a database
    const requirements: Record<string, ComplianceRequirement[]> = {
      'SOC2': [
        {
          id: 'cc6.1',
          name: 'Logical and Physical Access Controls',
          description: 'The entity implements logical and physical access security measures to protect against threats from sources outside its system boundaries.',
          category: 'Access Control',
          priority: 'high',
          status: 'not_assessed',
          evidence: [],
          lastReviewed: '',
          reviewedBy: ''
        },
        {
          id: 'cc6.2',
          name: 'System Access',
          description: 'Prior to issuing system credentials and granting system access, the entity registers and authorizes new internal and external users whose access is administered by the entity.',
          category: 'Access Control',
          priority: 'high',
          status: 'not_assessed',
          evidence: [],
          lastReviewed: '',
          reviewedBy: ''
        }
      ],
      'GDPR': [
        {
          id: 'art32',
          name: 'Security of Processing',
          description: 'The controller and the processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk.',
          category: 'Data Protection',
          priority: 'high',
          status: 'not_assessed',
          evidence: [],
          lastReviewed: '',
          reviewedBy: ''
        }
      ]
    };

    return requirements[standard] || [];
  }

  private getComplianceControls(
    standard: ComplianceFramework['standard'],
    version: string
  ): ComplianceControl[] {
    // Mock compliance controls - in real implementation, this would load from a database
    const controls: Record<string, ComplianceControl[]> = {
      'SOC2': [
        {
          id: 'cc6.1.1',
          name: 'Network Security Controls',
          description: 'Implement network security controls to protect against external threats',
          requirementId: 'cc6.1',
          type: 'preventive',
          implementation: 'Firewall, IDS/IPS, network segmentation',
          testing: 'Penetration testing, vulnerability scanning',
          frequency: 'Quarterly',
          owner: 'Security Team',
          status: 'implemented'
        }
      ],
      'GDPR': [
        {
          id: 'art32.1',
          name: 'Data Encryption',
          description: 'Implement encryption for personal data at rest and in transit',
          requirementId: 'art32',
          type: 'preventive',
          implementation: 'AES-256 encryption, TLS 1.3',
          testing: 'Encryption testing, key management audit',
          frequency: 'Annually',
          owner: 'Security Team',
          status: 'implemented'
        }
      ]
    };

    return controls[standard] || [];
  }

  private initializeDefaultPolicies(): void {
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'policy_default_1',
        name: 'Default Access Policy',
        description: 'Default policy for user access control',
        category: 'access',
        rules: [
          {
            id: 'rule_1',
            name: 'Admin Access',
            description: 'Allow admin users full access',
            resource: '*',
            action: '*',
            effect: 'allow',
            conditions: [
              {
                field: 'user.role',
                operator: 'equals',
                value: 'admin',
                description: 'User has admin role'
              }
            ],
            exceptions: []
          }
        ],
        conditions: [],
        actions: [],
        isActive: true,
        priority: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      }
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }
}
