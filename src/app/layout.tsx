import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ehtesham-aalam.dev"),
  title: {
    default: "Ehtesham Aalam | Full Stack Developer",
    template: "%s | Ehtesham Aalam"
  },
  description:
    "Full-stack developer portfolio for modern web applications, data-driven products, and polished user experiences.",
  keywords: [
    "Ehtesham Aalam",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "MongoDB",
    "Portfolio"
  ],
  authors: [{ name: "Ehtesham Aalam" }],
  openGraph: {
    title: "Ehtesham Aalam | Full Stack Developer",
    description:
      "Modern full-stack portfolio showcasing projects, skills, certificates, and engineering experience.",
    type: "website",
    images: ["/images/portfolio-hero.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
