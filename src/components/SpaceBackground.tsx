"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  CelestialGasGiant,
  CelestialOceanWorld,
  CelestialDeepNebula,
  ShootingMeteors
} from "@/components/three/CelestialBodies";

/**
 * Uniform random point distribution inside a 3D sphere.
 * Exact algorithm from maath/random/dist/maath-random.esm used by sanidhyy/space-portfolio.
 */
function inSphere(buffer: Float32Array, radius = 1.2) {
  for (let i = 0; i < buffer.length; i += 3) {
    const u = Math.random();
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    const z = Math.random() * 2 - 1;
    const mag = Math.sqrt(x * x + y * y + z * z) || 1;
    const r = Math.cbrt(u) * radius;
    buffer[i] = (x / mag) * r;
    buffer[i + 1] = (y / mag) * r;
    buffer[i + 2] = (z / mag) * r;
  }
  return buffer;
}

/**
 * Sanidhyy Space-Portfolio Signature 3D Star Sphere (Stars / StarBackground)
 * Exactly reproduces the space background from spaceportfolio.netlify.app.
 */
function StarBackground({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => inSphere(new Float32Array(5000), 1.2));

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

/**
 * Secondary Ethereal Violet Stardust Layer
 * Provides the signature purple glow seen in spaceportfolio.netlify.app
 */
function VioletStardust({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const [sphere] = useState(() => inSphere(new Float32Array(3200), 1.35));

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.x += delta / 16;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, -Math.PI / 6]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled
      >
        <PointMaterial
          transparent
          color="#c4b5fd"
          size={0.0028}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/**
 * Signature 3D Stars & Scroll-synced Celestial Objects Canvas
 * On landing page: pure rotating stars & black hole glow.
 * Below Encryption lock down to footer: 3D Ringed Gas Giant, Twilight Ocean World,
 * shooting meteors, and swirling deep nebula.
 */
export default function SpaceBackground() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="w-full h-auto fixed inset-0 z-0 pointer-events-none"
    >
      <Canvas
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Subtle celestial lighting for 3D planetary surfaces */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 3, 3]} intensity={1.6} color="#e0e7ff" />
        <pointLight position={[-3, -2, 1]} intensity={0.8} color="#00f0ff" />

        <Suspense fallback={null}>
          {/* Universal 3D Starfield from spaceportfolio.netlify.app */}
          <StarBackground reduced={reduced} />
          <VioletStardust reduced={reduced} />

          {/* 3D Celestial Objects that glide into view below Encryption down to Footer */}
          {!reduced && (
            <>
              <CelestialGasGiant scrollProgress={scrollProgress} />
              <CelestialOceanWorld scrollProgress={scrollProgress} />
              <CelestialDeepNebula scrollProgress={scrollProgress} />
              <ShootingMeteors scrollProgress={scrollProgress} />
            </>
          )}
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
