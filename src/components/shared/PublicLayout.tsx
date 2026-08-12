import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/**
 * Shared chrome for single-section routes (e.g. /about) that render one
 * anchored section of the one-page portfolio. The primary experience lives on
 * the home page.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main id="content" className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
