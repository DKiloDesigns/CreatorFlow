"use client";

type SimpleBillingClientProps = {
  user: {
    id: string;
    stripeCustomerId: string | null;
    plan: string | null;
    stripeSubscriptionId: string | null;
    stripeCurrentPeriodEnd: string | null;
    _count: {
      posts: number;
      socialAccounts: number;
    };
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SimpleBillingClient({ user, searchParams }: SimpleBillingClientProps) {
  console.log("SimpleBillingClient: Component rendering", { 
    userExists: !!user, 
    searchParamsExists: !!searchParams
  });

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription (Simple)</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <p>Plan: {user?.plan || 'Free'}</p>
        {user?.stripeCurrentPeriodEnd && (
          <p>Next Billing Date: {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}</p>
        )}
        <div className="mt-4">
          <p>Posts: {user?._count.posts || 0}</p>
          <p>Connected Accounts: {user?._count.socialAccounts || 0}</p>
        </div>
      </div>
    </div>
  );
}