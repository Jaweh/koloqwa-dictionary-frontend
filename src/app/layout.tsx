import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export const metadata: Metadata = {
  title: {
    default: "Koloqwa Dictionary — Liberian Languages",
    template: "%s | Koloqwa Dictionary",
  },
  description:
    "The definitive dictionary for Liberian local language words and phrases. Explore Kpelle, Bassa, Grebo, Vai, Mende and more.",
  keywords: ["Liberia", "Kpelle", "Bassa", "Grebo", "Vai", "Mende", "dictionary", "African languages"],
  openGraph: {
    siteName: "Koloqwa Dictionary",
    type: "website",
    locale: "en_LR",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://koloqwa.lr",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://koloqwa.lr"}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Koloqwa Dictionary — Liberian Languages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koloqwa Dictionary — Liberian Languages",
    description: "The definitive dictionary for Liberian local language words and phrases.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <VerificationBanner />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}