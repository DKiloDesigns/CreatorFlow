import { monitoring } from '@/lib/monitoring';

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'performance' | 'security' | 'business' | 'technical';
  metadata: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  timeWindow: number; // minutes
  severity: Alert['severity'];
  category: Alert['category'];
  enabled: boolean;
  actions: string[];
}

class AlertManager {
  private static instance: AlertManager;
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private subscribers: ((alert: Alert) => void)[] = [];

  static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  // Initialize default alert rules
  initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'high-error-rate',
        name: 'High Error Rate',
        condition: 'error_rate > 5',
        threshold: 5,
        timeWindow: 5,
        severity: 'critical',
        category: 'technical',
        enabled: true,
        actions: ['email', 'slack'],
      },
      {
        id: 'slow-response-time',
        name: 'Slow Response Time',
        condition: 'avg_response_time > 2000',
        threshold: 2000,
        timeWindow: 10,
        severity: 'high',
        category: 'performance',
        enabled: true,
        actions: ['email'],
      },
      {
        id: 'high-memory-usage',
        name: 'High Memory Usage',
        condition: 'memory_usage > 80',
        threshold: 80,
        timeWindow: 5,
        severity: 'medium',
        category: 'performance',
        enabled: true,
        actions: ['email'],
      },
      {
        id: 'database-connection-issues',
        name: 'Database Connection Issues',
        condition: 'db_connection_failures > 3',
        threshold: 3,
        timeWindow: 5,
        severity: 'critical',
        category: 'technical',
        enabled: true,
        actions: ['email', 'slack', 'pagerduty'],
      },
      {
        id: 'unusual-traffic-spike',
        name: 'Unusual Traffic Spike',
        condition: 'request_rate > 1000',
        threshold: 1000,
        timeWindow: 1,
        severity: 'high',
        category: 'business',
        enabled: true,
        actions: ['email', 'slack'],
      },
    ];
  }

  // Create a new alert
  createAlert(
    type: Alert['type'],
    title: string,
    message: string,
    severity: Alert['severity'],
    category: Alert['category'],
    metadata: Record<string, any> = {}
  ): Alert {
    const alert: Alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      severity,
      category,
      metadata,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.alerts.push(alert);
    this.notifySubscribers(alert);
    this.executeActions(alert);

    monitoring.info('Alert created', {
      alertId: alert.id,
      type: alert.type,
      severity: alert.severity,
      category: alert.category,
    });

    return alert;
  }

  // Get all alerts
  getAlerts(filters?: {
    severity?: Alert['severity'][];
    category?: Alert['category'][];
    acknowledged?: boolean;
    limit?: number;
  }): Alert[] {
    let filteredAlerts = [...this.alerts];

    if (filters?.severity) {
      filteredAlerts = filteredAlerts.filter(alert => filters.severity!.includes(alert.severity));
    }

    if (filters?.category) {
      filteredAlerts = filteredAlerts.filter(alert => filters.category!.includes(alert.category));
    }

    if (filters?.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.acknowledged === filters.acknowledged);
    }

    if (filters?.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit);
    }

    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Acknowledge an alert
  acknowledgeAlert(alertId: string, acknowledgedBy: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();

    monitoring.info('Alert acknowledged', {
      alertId,
      acknowledgedBy,
    });

    return true;
  }

  // Add alert rule
  addRule(rule: AlertRule): void {
    this.rules.push(rule);
    monitoring.info('Alert rule added', { ruleId: rule.id, ruleName: rule.name });
  }

  // Update alert rule
  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return false;

    this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    monitoring.info('Alert rule updated', { ruleId });
    return true;
  }

  // Delete alert rule
  deleteRule(ruleId: string): boolean {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) return false;

    this.rules.splice(ruleIndex, 1);
    monitoring.info('Alert rule deleted', { ruleId });
    return true;
  }

  // Get all rules
  getRules(): AlertRule[] {
    return [...this.rules];
  }

  // Check metrics against rules and create alerts
  checkMetrics(metrics: Record<string, number>): void {
    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      const metricValue = metrics[rule.condition.split(' ')[0]];
      if (metricValue === undefined) continue;

      const threshold = rule.threshold;
      const isTriggered = this.evaluateCondition(rule.condition, metricValue, threshold);

      if (isTriggered) {
        this.createAlert(
          'warning',
          rule.name,
          `${rule.name} threshold exceeded: ${metricValue} > ${threshold}`,
          rule.severity,
          rule.category,
          {
            ruleId: rule.id,
            metricValue,
            threshold,
            condition: rule.condition,
          }
        );
      }
    }
  }

  // Subscribe to alert notifications
  subscribe(callback: (alert: Alert) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Get alert statistics
  getAlertStats(): {
    total: number;
    bySeverity: Record<Alert['severity'], number>;
    byCategory: Record<Alert['category'], number>;
    unacknowledged: number;
    last24Hours: number;
  } {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const bySeverity = this.alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<Alert['severity'], number>);

    const byCategory = this.alerts.reduce((acc, alert) => {
      acc[alert.category] = (acc[alert.category] || 0) + 1;
      return acc;
    }, {} as Record<Alert['category'], number>);

    return {
      total: this.alerts.length,
      bySeverity,
      byCategory,
      unacknowledged: this.alerts.filter(a => !a.acknowledged).length,
      last24Hours: this.alerts.filter(a => a.timestamp >= last24Hours).length,
    };
  }

  // Clear old alerts
  clearOldAlerts(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialCount = this.alerts.length;
    this.alerts = this.alerts.filter(alert => alert.timestamp >= cutoffDate);
    const removedCount = initialCount - this.alerts.length;

    monitoring.info('Cleared old alerts', {
      removedCount,
      daysToKeep,
    });
  }

  private evaluateCondition(condition: string, value: number, threshold: number): boolean {
    const operator = condition.split(' ')[1];
    
    switch (operator) {
      case '>':
        return value > threshold;
      case '>=':
        return value >= threshold;
      case '<':
        return value < threshold;
      case '<=':
        return value <= threshold;
      case '==':
        return value === threshold;
      case '!=':
        return value !== threshold;
      default:
        return false;
    }
  }

  private notifySubscribers(alert: Alert): void {
    this.subscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        monitoring.error('Error in alert subscriber callback', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  private executeActions(alert: Alert): void {
    // Find the rule that triggered this alert
    const rule = this.rules.find(r => r.name === alert.title);
    if (!rule) return;

    for (const action of rule.actions) {
      try {
        this.executeAction(action, alert);
      } catch (error) {
        monitoring.error('Failed to execute alert action', {
          action,
          alertId: alert.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  private executeAction(action: string, alert: Alert): void {
    switch (action) {
      case 'email':
        this.sendEmailAlert(alert);
        break;
      case 'slack':
        this.sendSlackAlert(alert);
        break;
      case 'pagerduty':
        this.sendPagerDutyAlert(alert);
        break;
      default:
        monitoring.warn('Unknown alert action', { action });
    }
  }

  private sendEmailAlert(alert: Alert): void {
    // Implementation would integrate with email service
    monitoring.info('Email alert sent', {
      alertId: alert.id,
      severity: alert.severity,
    });
  }

  private sendSlackAlert(alert: Alert): void {
    // Implementation would integrate with Slack webhook
    monitoring.info('Slack alert sent', {
      alertId: alert.id,
      severity: alert.severity,
    });
  }

  private sendPagerDutyAlert(alert: Alert): void {
    // Implementation would integrate with PagerDuty API
    monitoring.info('PagerDuty alert sent', {
      alertId: alert.id,
      severity: alert.severity,
    });
  }
}

export const alertManager = AlertManager.getInstance(); 