import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import TickerTape from "@/components/TickerTape";

export const metadata: Metadata = {
  title: "India Venture Index | IND-V Dashboard",
  description: "Tracking India's VC-backed startup ecosystem, benchmarked against the Nifty 50.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TickerTape />
        <header className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="font-display text-2xl tracking-tight">IND-V</span>
              <span className="font-data text-xs text-muted uppercase tracking-widest">
                India Venture Index
              </span>
            </Link>
            <nav className="flex gap-6 font-data text-sm uppercase tracking-wide">
              <Link href="/" className="text-foreground/90 hover:text-accent transition-colors">
                Dashboard
              </Link>
              <Link href="/companies" className="text-foreground/90 hover:text-accent transition-colors">
                Companies
              </Link>
              <Link href="/methodology" className="text-foreground/90 hover:text-accent transition-colors">
                Methodology
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border mt-16">
          <div className="max-w-6xl mx-auto px-6 py-6 text-xs text-muted font-data">
            Data via Yahoo Finance (unofficial). For educational purposes only — not investment advice.
          </div>
        </footer>
      </body>
    </html>
  );
}
