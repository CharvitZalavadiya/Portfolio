import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charvit Zalavadiya",
  description: "Everything about me, my work, and my projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased h-[100dvh] w-[100dvw]">
        {children}
      </body>
    </html>
  );
}
