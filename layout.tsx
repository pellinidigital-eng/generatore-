import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generatore Contenuti Social PRO",
  description: "Genera hook, caption, caroselli e CTA social da adattare al tuo brand."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
