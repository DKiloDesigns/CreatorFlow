export function FeatureCard({ icon, title, description, plan }: { icon: string; title: string; description: string; plan?: string }) {
  return (
    <div className="relative bg-[var(--card)] rounded-xl shadow p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-slate-600">
      {plan && (
        <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold rounded ${plan === 'Pro' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>
          {plan}
        </span>
      )}
      <span className="text-4xl">{icon}</span>
      <h3 className="font-bold text-lg text-center text-[var(--card-foreground)]">{title}</h3>
      <p className="text-sm text-center text-[var(--card-foreground)]">{description}</p>
    </div>
  );
} 