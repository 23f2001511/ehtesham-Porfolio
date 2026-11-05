"use client";

import React, { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

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
 * Signature 3D Stars Canvas from https://spaceportfolio.netlify.app/
 */
export default function SpaceBackground() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        <Suspense fallback={null}>
          <StarBackground reduced={reduced} />
          <VioletStardust reduced={reduced} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
