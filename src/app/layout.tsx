import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chess Opening Tutor",
  description:
    "A local-first practice app for learning the London System and Caro-Kann by playing moves on the board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link className="brand" href="/">
                <span className="brand-name">Chess Opening Tutor</span>
                <span className="brand-context">London System and Caro-Kann</span>
              </Link>
              <nav className="nav-links" aria-label="Primary navigation">
                <Link className="nav-link" href="/">
                  Home
                </Link>
                <Link className="nav-link" href="/practice">
                  Practice
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

