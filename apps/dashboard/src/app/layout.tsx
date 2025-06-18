import type { Metadata } from "next";
import {
  Figtree,
  Sora,
  Fira_Code,
  Josefin_Sans,
  Inter,
} from "next/font/google";
import "./globals.css";
import "../../public/fa/css/all.min.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { NotificationContainer } from "@/components/notification";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Astra",
  description: "Astra is a next-generation AI-powered Discord bot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${figtree.variable} ${sora.variable} ${firaCode.variable} ${josefinSans.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AlertProvider>
            {children}
            <NotificationContainer />
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
