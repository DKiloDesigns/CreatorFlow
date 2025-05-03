import React from 'react';
import { Heading } from '@/components/ui/heading'; // Assuming a shared Heading component
import AccountConnectButtons from '@/components/dashboard/accounts/account-connect-buttons';
import ConnectedAccountList from '@/components/dashboard/accounts/connected-account-list';
import { Separator } from "@/components/ui/separator";

export default function AccountsPage() {
  // TODO: Add logic here to read query params for success/error messages from OAuth callback
  // and potentially display initial toasts

  return (
    <div className="space-y-6">
      <Heading
        title="Connected Accounts"
        description="Manage your connected social media accounts and add new ones."
      />

      {/* Section to Add New Accounts */}
      <section>
        <AccountConnectButtons />
      </section>

      <Separator />

      {/* Section to Display Connected Accounts */}
      <section>
        <h3 className="text-lg font-medium mb-4">Your Connections</h3>
         <ConnectedAccountList />
      </section>
    </div>
  );
} 