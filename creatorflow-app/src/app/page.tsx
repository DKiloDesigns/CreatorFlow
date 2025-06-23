import Link from "next/link";
import { FEATURES, HOW_IT_WORKS, TESTIMONIALS } from "@/data/landing";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";

const PLANS = [
  {
    name: "Free",
    price: "$0/month",
    features: ["1 social account", "Basic analytics", "Community access"],
    cta: "Get Started",
    href: "/signin",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12/month",
    features: ["5 social accounts", "Advanced analytics", "Monetization dashboard", "Priority support"],
    cta: "Start Free Trial",
    href: "/signin",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    features: ["Unlimited accounts", "Custom integrations", "Dedicated manager"],
    cta: "Contact Sales",
    href: "/contact",
    highlight: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-slate-100 dark:from-[#18181b] dark:to-[#23272f]">
      {/* Hero Section */}
      <header className="w-full flex flex-col items-center justify-center px-6 py-16 border-b border-slate-200 dark:border-slate-800 text-center gap-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl">
          Empower Your Content. <span className="text-primary">Grow Your Audience.</span> Monetize Your Passion.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          The all-in-one platform for creators to plan, publish, analyze, and get paid—everywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signin" className="inline-block bg-primary text-white font-semibold rounded-lg px-8 py-3 shadow hover:bg-primary/90 transition">
            Start Free
          </Link>
          <Link href="#how-it-works" className="inline-block border border-primary text-primary font-semibold rounded-lg px-8 py-3 shadow hover:bg-primary hover:text-white transition">
            See CreatorFlow in Action
          </Link>
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 py-16" id="features">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} plan={feature.plan} />
        ))}
      </section>

      {/* Plans Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center gap-8" id="plans">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow p-6 flex flex-col items-center border transition-transform ${plan.highlight ? 'border-2 border-primary scale-105' : 'border-slate-100'} dark:bg-slate-800`}
            >
              <h2 className="font-bold text-xl mb-2">{plan.name}</h2>
              <p className="mb-4">{plan.price}</p>
              <ul className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                {plan.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Link href={plan.href} className="bg-primary text-white px-6 py-2 rounded text-center w-full block">
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-8" id="how-it-works">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
        <ol className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
          {HOW_IT_WORKS.map((step, idx) => (
            <li key={idx} className="flex flex-col items-center gap-2 max-w-xs">
              <span className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg">{idx + 1}</span>
              <span className="text-base text-slate-700 dark:text-slate-200 text-center">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Creators Love CreatorFlow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {TESTIMONIALS.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Trust & Transparency</h3>
        <p className="text-center text-slate-600 dark:text-slate-300">
          No hidden fees. Your data, your way. <br />Built by creators, for creators.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col items-center gap-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <nav className="flex gap-4 mb-1">
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/community">Community</Link>
          <Link href="/support">Support</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/#plans">Plans</Link>
        </nav>
        <div className="flex gap-3">
          <a href="#" aria-label="YouTube">🎥</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="TikTok">🎵</a>
          <a href="#" aria-label="X">🐦</a>
          <a href="#" aria-label="Discord">💬</a>
        </div>
        <span>&copy; {new Date().getFullYear()} CreatorFlow. All rights reserved.</span>
        <span>Made with ❤️ for creators.</span>
      </footer>
    </div>
  );
}
