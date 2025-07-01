'use client';

import { useState } from "react";
import { ThemeToggle } from '@/components/theme-toggle';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-lg mx-auto py-16 px-4 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Sales</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 rounded p-6 text-center font-semibold">
          Thank you for reaching out! We'll get back to you soon.
        </div>
      ) : (
        <form
          className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 flex flex-col gap-6 border border-slate-100 dark:border-slate-700"
          onSubmit={e => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Name</label>
            <input id="name" name="name" type="text" required className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
            <input id="email" name="email" type="email" required className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Message</label>
            <textarea id="message" name="message" rows={5} required className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-semibold">Send Message</button>
        </form>
      )}
    </div>
  );
} 