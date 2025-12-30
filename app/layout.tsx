import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortune - Monopoly Game",
  description: "Play Fortune, a multiplayer Monopoly-like game with friends online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div>
          {/* Header */}
          <header>
            <div>
              <div>
                <div>
                  <span>🎲</span>
                </div>
                <h1>
                  Fortune
                </h1>
              </div>
              <p>
                Multiplayer Board Game
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main>
            {children}
          </main>

          {/* Footer */}
          <footer>
            <div>
              <p>
                © 2025 Fortune Game. Built with Next.js + Socket.io
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
