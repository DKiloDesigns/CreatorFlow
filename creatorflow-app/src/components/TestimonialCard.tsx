export function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <blockquote className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700 flex flex-col gap-3">
      <p className="text-slate-700 dark:text-slate-200 italic">“{quote}”</p>
      <footer className="text-sm text-slate-500 dark:text-slate-400 text-right">{author}</footer>
    </blockquote>
  );
} 