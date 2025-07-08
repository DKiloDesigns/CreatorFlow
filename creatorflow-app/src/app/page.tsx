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
    href: "/auth",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12/month",
    features: ["5 social accounts", "Advanced analytics", "Monetization dashboard", "Priority support"],
    cta: "Start Free Trial",
    href: "/auth",
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <header className="w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 border-b border-border text-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl">
          Empower Your Content. <span className="text-primary">Grow Your Audience.</span> Monetize Your Passion.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
          The all-in-one platform for creators to plan, publish, analyze, and get paid—everywhere.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/auth" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg px-6 sm:px-8 py-2 sm:py-3 shadow hover:from-blue-600 hover:to-purple-700 transition text-sm sm:text-base">
            Start Free
          </Link>
          <Link href="#how-it-works" className="inline-block border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-border text-white font-semibold rounded-lg px-6 sm:px-8 py-2 sm:py-3 shadow hover:from-blue-600 hover:to-purple-700 transition text-sm sm:text-base">
            See CreatorFlow in Action
          </Link>
        </div>
      </header>

      {/* Feature Highlights */}
      <section className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 px-4 py-12 sm:py-16" id="features">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} plan={feature.plan} />
        ))}
      </section>

      {/* Plans Section */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16" id="plans">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 flex flex-col ${
                plan.highlight ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">{plan.price}</p>
              <ul className="mb-8 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`inline-block text-center font-semibold rounded-lg px-6 py-3 transition ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16" id="how-it-works">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">Get started in minutes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {HOW_IT_WORKS.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                {index + 1}
              </div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Creators Say</h2>
          <p className="text-lg text-muted-foreground">Join thousands of successful creators</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.author} {...testimonial} />
          ))}
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-foreground">Trust & Transparency</h3>
        <p className="text-center text-muted-foreground">
          No hidden fees. Your data, your way. <br />Built by creators, for creators.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col items-center gap-2 border-t border-border text-xs text-muted-foreground">
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
