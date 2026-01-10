import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortune",
  description: "Monopoly Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>🎲 Fortune</h1>
        </header>
        <main>{children}</main>
        <footer>
          <p>© 2026 Fortune</p>
        </footer>
      </body>
    </html>
  );
}
