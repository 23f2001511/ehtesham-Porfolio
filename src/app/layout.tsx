import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import PageBackground, { ScrollProgress } from "@/components/shared/PageBackground";
import SpaceBackground from "@/components/SpaceBackground";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
});

// Display face — used with restraint on the wordmark, hero name, section
// headings, and large numerals for a distinct, engineered personality.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-space"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ehtesham-aalam.dev"),
  title: {
    default: "Ehtesham Aalam | Full-Stack Developer",
    template: "%s | Ehtesham Aalam"
  },
  description:
    "Portfolio of Ehtesham Aalam — full-stack developer building modern web applications, with live GitHub and LeetCode analytics.",
  keywords: [
    "Ehtesham Aalam",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "React",
    "Portfolio"
  ],
  authors: [{ name: "Ehtesham Aalam" }],
  openGraph: {
    title: "Ehtesham Aalam | Full-Stack Developer",
    description:
      "Modern developer portfolio with projects, real GitHub activity, and LeetCode analytics.",
    type: "website",
    images: ["/images/portfolio-hero.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* anti-flicker: apply the stored/system theme class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");var l=t==="light"||(!t&&window.matchMedia("(prefers-color-scheme: light)").matches);if(l)document.documentElement.classList.add("light");}catch(e){}'
          }}
        />
      </head>
      <body className="noise antialiased">
        <PageBackground />
        <SpaceBackground />
        <ScrollProgress />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
