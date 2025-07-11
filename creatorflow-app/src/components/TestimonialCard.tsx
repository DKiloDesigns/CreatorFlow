export function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <blockquote className="bg-gray-50 rounded-xl shadow p-6 border border-gray-200 flex flex-col gap-3">
      <p className="text-black italic">"{quote}"</p>
      <footer className="text-sm text-gray-700 text-right">{author}</footer>
    </blockquote>
  );
} 