import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/shared/theme-provider";
import SiteShell from "@/components/shared/site-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maths-pour-bg.vercel.app"),
  title: "Maths Pour BG | Master Mathematics. Build Your Future.",
  description:
    "Préparez-vous pour le BG1 et BG2 avec des cours de mathématiques professionnels en Tunisie. Plus de 500 étudiants, 98% de taux de réussite.",
  keywords: [
    "mathématiques",
    "BG1",
    "BG2",
    "cours",
    "Tunisie",
    "baccalauréat",
    "maths",
    "préparation",
    "examens",
  ],
  authors: [{ name: "Maths Pour BG" }],
  creator: "Maths Pour BG",
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: "https://maths-pour-bg.vercel.app",
    siteName: "Maths Pour BG",
    title: "Maths Pour BG | Master Mathematics. Build Your Future.",
    description:
      "Préparez-vous pour le BG1 et BG2 avec des cours de mathématiques professionnels en Tunisie.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Maths Pour BG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maths Pour BG | Master Mathematics. Build Your Future.",
    description:
      "Préparez-vous pour le BG1 et BG2 avec des cours de mathématiques professionnels.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const themeScript = `
  try {
    if (localStorage.getItem('theme') === 'light' && !window.location.pathname.startsWith('/admin')) {
      document.documentElement.classList.add('light');
    }
  } catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#030712" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
