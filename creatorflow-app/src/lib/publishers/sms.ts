import { Post, SocialAccount } from '@prisma/client';
import { PlatformResult } from '../publishing';
import { decrypt } from '@/lib/crypto';

export interface SMSPostData {
  message: string;
  toNumber?: string;
  fromNumber?: string;
}

export class SMSPublisher {
  private accountSid: string;
  private authToken: string;

  constructor(account: SocialAccount) {
    const decryptedToken = decrypt(account.encryptedAccessToken || '');
    if (!decryptedToken) {
      throw new Error('No valid SMS credentials found');
    }
    
    const credentials = JSON.parse(decryptedToken);
    this.accountSid = credentials.accountSid;
    this.authToken = credentials.authToken;
  }

  async post(data: SMSPostData): Promise<boolean> {
    try {
      const toNumber = data.toNumber || process.env.SMS_DEFAULT_TO_NUMBER;
      const fromNumber = data.fromNumber || process.env.SMS_DEFAULT_FROM_NUMBER;
      
      if (!toNumber) {
        throw new Error('No SMS recipient number specified');
      }
      
      if (!fromNumber) {
        throw new Error('No SMS sender number specified');
      }

      const messageData = new URLSearchParams({
        To: toNumber,
        From: fromNumber,
        Body: data.message,
      });

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: messageData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`SMS API error: ${error}`);
      }

      console.log('✅ SMS sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send SMS:', error);
      return false;
    }
  }

  async validateCredentials(): Promise<boolean> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        },
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getPhoneNumbers(): Promise<Array<{ number: string; friendlyName: string }>> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/IncomingPhoneNumbers.json`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SMS phone numbers');
      }

      const result = await response.json();
      
      return result.incoming_phone_numbers.map((phone: any) => ({
        number: phone.phone_number,
        friendlyName: phone.friendly_name || phone.phone_number,
      }));
    } catch (error) {
      console.error('❌ Failed to get SMS phone numbers:', error);
      return [];
    }
  }
}

export async function publishToSMS(
  post: Post,
  account: SocialAccount
): Promise<PlatformResult> {
  try {
    const publisher = new SMSPublisher(account);
    
    const success = await publisher.post({
      message: post.contentText || 'CreatorFlow Post',
      toNumber: (account as any).metadata?.toNumber,
      fromNumber: (account as any).metadata?.fromNumber,
    });

    if (success) {
      return {
        platform: 'sms',
        success: true,
        platformPostId: `sms_${Date.now()}`,
      };
    } else {
      return {
        platform: 'sms',
        success: false,
        error: 'Failed to send SMS',
      };
    }
  } catch (error) {
    return {
      platform: 'sms',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown SMS API error',
    };
  }
} 