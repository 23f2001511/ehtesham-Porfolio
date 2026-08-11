"use client";

import dynamic from "next/dynamic";

const PortfolioOS = dynamic(() => import("@/components/os/PortfolioOS"), {
  loading: () => (
    <div className="os-boot" aria-busy="true" aria-label="Loading developer OS">
      <div className="os-boot__panel">
        <div className="os-boot__mark" aria-hidden="true">
          <span className="os-boot__mark-glyph">ea</span>
        </div>
        <p className="os-boot__title">Developer OS</p>
        <p className="os-boot__subtitle">starting session…</p>
      </div>
    </div>
  )
});

export default function Home() {
  return <PortfolioOS />;
}
