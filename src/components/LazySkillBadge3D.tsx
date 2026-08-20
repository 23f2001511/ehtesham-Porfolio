"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const SkillBadge3D = dynamic(() => import("@/components/SkillBadge3D"), {
  ssr: false,
  loading: () => null
});

type LazySkillBadge3DProps = {
  color?: string;
  size?: number;
};

export default function LazySkillBadge3D({ color, size = 40 }: LazySkillBadge3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="shrink-0" style={{ width: size, height: size }}>
      {visible ? <SkillBadge3D color={color} size={size} /> : null}
    </div>
  );
}