import type { Metadata, Viewport } from "next";
import { Kalnia } from "next/font/google"
import "./globals.css";

export const metadata: Metadata = {
  title: "Purrr.chat | Connect Now",
  description: "You can now connect with a random stranger online and chat.",
  metadataBase: new URL(process.env.BASE_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: "resizes-content",
}

const kalnia = Kalnia({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kalnia.className}>
        {children}
      </body>
    </html>
  );
}
