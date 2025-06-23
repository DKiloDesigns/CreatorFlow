export default function Pricing() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2">Free</h2>
          <p className="mb-4">$0/month</p>
          <ul className="mb-6 text-sm text-slate-600">
            <li>✓ 1 social account</li>
            <li>✓ Basic analytics</li>
            <li>✓ Community access</li>
          </ul>
          <button className="bg-primary text-white px-6 py-2 rounded">Get Started</button>
        </div>
        {/* Pro Plan */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center border-2 border-primary scale-105">
          <h2 className="font-bold text-xl mb-2">Pro</h2>
          <p className="mb-4">$12/month</p>
          <ul className="mb-6 text-sm text-slate-600">
            <li>✓ 5 social accounts</li>
            <li>✓ Advanced analytics</li>
            <li>✓ Monetization dashboard</li>
            <li>✓ Priority support</li>
          </ul>
          <button className="bg-primary text-white px-6 py-2 rounded">Start Free Trial</button>
        </div>
        {/* Enterprise Plan */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2">Enterprise</h2>
          <p className="mb-4">Contact us</p>
          <ul className="mb-6 text-sm text-slate-600">
            <li>✓ Unlimited accounts</li>
            <li>✓ Custom integrations</li>
            <li>✓ Dedicated manager</li>
          </ul>
          <button className="bg-primary text-white px-6 py-2 rounded">Contact Sales</button>
        </div>
      </div>
    </div>
  );
} 