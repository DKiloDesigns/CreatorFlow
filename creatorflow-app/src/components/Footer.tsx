import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-6 flex flex-col items-center gap-2 border-t border-border text-xs text-muted-foreground">
      <nav className="flex gap-4 mb-1">
        <Link href="/about">About</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/support">Support</Link>
        <Link href="/#plans">Plans</Link>
      </nav>
      <div className="flex gap-3">
        <a href="#" aria-label="YouTube" className="min-w-[44px] min-h-[44px] flex items-center justify-center">🎥</a>
        <a href="#" aria-label="Instagram" className="min-w-[44px] min-h-[44px] flex items-center justify-center">📸</a>
        <a href="#" aria-label="TikTok" className="min-w-[44px] min-h-[44px] flex items-center justify-center">🎵</a>
        <a href="#" aria-label="X" className="min-w-[44px] min-h-[44px] flex items-center justify-center">🐦</a>
        <a href="#" aria-label="Discord" className="min-w-[44px] min-h-[44px] flex items-center justify-center">💬</a>
      </div>
      <span>&copy; {new Date().getFullYear()} CreatorFlow. All rights reserved.</span>
      <span>Made with ❤️ for creators.</span>
    </footer>
  );
} 