"use client";

export default function SimpleBillingClient({ user, searchParams }: any) {
  console.log("SimpleBillingClient: Component rendering", { 
    userExists: !!user, 
    searchParamsExists: !!searchParams
  });

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
      <p>This is a simplified billing client component for debugging purposes.</p>
      <div className="bg-white shadow rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <p>Plan: {user?.plan || 'Free'}</p>
        <p>User ID: {user?.id || 'Not available'}</p>
        <p>Stripe Customer ID: {user?.stripeCustomerId || 'Not available'}</p>
      </div>
    </div>
  );
}