import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-slate-100 dark:from-[#18181b] dark:to-[#23272f]">
      <header className="w-full flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">CreatorFlow</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
          <Link href="/signin" className="text-sm font-medium hover:underline">Sign In</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 gap-12">
        {/* Hero Section */}
        <section className="max-w-2xl text-center flex flex-col items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Grow Your Brand. <span className="text-primary">Automate</span> Your Content. <span className="text-primary">Monetize</span> Your Audience.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            CreatorFlow is the all-in-one platform for creators, brands, and teams to schedule, analyze, and monetize content across every channel.
          </p>
          <Link href="/signin" className="inline-block bg-primary text-white font-semibold rounded-lg px-8 py-3 mt-2 shadow hover:bg-primary/90 transition">
            Get Started
          </Link>
        </section>
        {/* Features Section */}
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-700">
            <svg className="h-8 w-8 text-primary dark:text-slate-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Automated Scheduling</h3>
            <p className="text-sm text-slate-600 dark:text-slate-100 text-center">Plan, schedule, and publish to all your social channels from one place. Never miss a post again.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-700">
            <svg className="h-8 w-8 text-primary dark:text-slate-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 17l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Analytics & Insights</h3>
            <p className="text-sm text-slate-600 dark:text-slate-100 text-center">Track growth, engagement, and ROI with beautiful, actionable dashboards.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-700">
            <svg className="h-8 w-8 text-primary dark:text-slate-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Monetization Tools</h3>
            <p className="text-sm text-slate-600 dark:text-slate-100 text-center">Connect with brands, manage collabs, and get paid—all inside CreatorFlow.</p>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 flex flex-col items-center gap-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span>&copy; {new Date().getFullYear()} CreatorFlow. All rights reserved.</span>
        <span>Made with ❤️ for creators.</span>
      </footer>
    </div>
  );
}
