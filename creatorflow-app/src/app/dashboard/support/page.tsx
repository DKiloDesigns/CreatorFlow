'use client';

import React, { useState } from 'react';
import { useUserSupport } from '@/hooks/useUserSupport';

export default function SupportPage() {
  const { loading, error, success, submitFeedback, setSuccess, setError } = useUserSupport();
  const [feedback, setFeedback] = useState('');

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    await submitFeedback(feedback);
    setFeedback('');
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Support / Help</h1>
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold mb-2">Resources</h2>
          <ul className="list-disc ml-6 text-blue-600">
            <li><a href="#" className="underline">FAQ / Knowledge Base</a></li>
            <li><a href="#" className="underline">System Status</a></li>
            <li><a href="#" className="underline">Community / Forum</a></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Contact Support</h2>
          <a href="mailto:support@creatorflow.com" className="bg-primary text-white px-4 py-2 rounded inline-block">Email Support</a>
          <button className="bg-gray-100 px-4 py-2 rounded ml-2" disabled>Live Chat (Coming Soon)</button>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Feedback</h2>
          <form className="space-y-2" onSubmit={handleFeedback}>
            <textarea className="w-full border rounded px-3 py-2" placeholder="Your feedback..." rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit Feedback'}</button>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-500">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
} 