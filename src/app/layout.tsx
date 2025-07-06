import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { silenceConsole } from "../utils/silenceConsole";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManojAI Chatbot",
  description: "ManojAI Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       {/* Load Google Identity Services SDK */}
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <Toaster />
        {children}
      </body>
    </html>
  );
}
