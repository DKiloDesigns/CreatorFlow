/**
 * Email template interface
 */
export interface EmailTemplate<T extends EmailTemplateData = EmailTemplateData> {
  subject: string;
  html: (data: T) => string;
}

/**
 * Base email template data
 */
export interface EmailTemplateData {
  [key: string]: any;
}

/**
 * Subscription created email data
 */
export interface SubscriptionCreatedData extends EmailTemplateData {
  plan: string;
  nextBillingDate: string;
}

/**
 * Subscription updated email data
 */
export interface SubscriptionUpdatedData extends EmailTemplateData {
  plan: string;
  nextBillingDate: string;
  changes: string[];
}

/**
 * Subscription cancelled email data
 */
export interface SubscriptionCancelledData extends EmailTemplateData {
  plan: string;
  endDate: string;
}

/**
 * Payment succeeded email data
 */
export interface PaymentSucceededData extends EmailTemplateData {
  amount: number;
  date: string;
  invoiceUrl: string;
}

/**
 * Payment failed email data
 */
export interface PaymentFailedData extends EmailTemplateData {
  amount: number;
  retryDate: string;
  retryCount: number;
  paymentIntentId: string;
  maxRetries: number;
  daysUntilNextRetry: number;
}