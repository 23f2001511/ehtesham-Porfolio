"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural gas giant planet texture generator (Saturn/Neptune style).
 * Generates rich horizontal atmospheric bands in violet, purple, cyan, and deep space blue.
 */
function createGasGiantTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, "#1e0b36");
  grad.addColorStop(0.15, "#4c1d95");
  grad.addColorStop(0.28, "#6d28d9");
  grad.addColorStop(0.42, "#8b5cf6");
  grad.addColorStop(0.55, "#3b0764");
  grad.addColorStop(0.68, "#7042f8");
  grad.addColorStop(0.82, "#06b6d4");
  grad.addColorStop(0.92, "#2e1065");
  grad.addColorStop(1.0, "#0f051d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Soft atmospheric noise bands
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let y = 10; y < 250; y += 14) {
    ctx.fillRect(0, y, 512, Math.random() * 4 + 2);
  }

  // Cyan jet stream ribbon
  ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
  ctx.fillRect(0, 110, 512, 6);
  ctx.fillRect(0, 150, 512, 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural planetary ring texture (Saturn-like translucent dust rings).
 */
function createRingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.1, "rgba(112, 66, 248, 0.2)");
  grad.addColorStop(0.25, "rgba(196, 181, 253, 0.6)");
  grad.addColorStop(0.38, "rgba(139, 92, 246, 0.3)");
  grad.addColorStop(0.45, "rgba(0, 0, 0, 0)"); // Cassini division gap
  grad.addColorStop(0.52, "rgba(0, 240, 255, 0.5)");
  grad.addColorStop(0.70, "rgba(168, 85, 247, 0.6)");
  grad.addColorStop(0.88, "rgba(112, 66, 248, 0.3)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 64);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural oceanic earth-like world texture.
 */
function createEarthLikeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep ocean baseline
  ctx.fillStyle = "#051329";
  ctx.fillRect(0, 0, 512, 256);

  // Bioluminescent continent outlines
  ctx.fillStyle = "#0d9488";
  ctx.beginPath();
  ctx.ellipse(120, 100, 60, 40, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(320, 130, 80, 50, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(220, 180, 45, 30, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Swirling cloud ribbons
  ctx.fillStyle = "rgba(224, 242, 254, 0.28)";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.ellipse(80 + i * 70, 70 + (i % 3) * 40, 40, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * 3D Ringed Gas Giant Planet (Active below Encryption: ~Projects to About section)
 */
export function CelestialGasGiant({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const planetTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createGasGiantTexture();
  }, []);

  const ringTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createRingTexture();
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Active range: starting below Encryption (~0.20) through Projects and About (~0.52)
    // 0 before 0.18; peaks around 0.35; fades out by 0.55
    let targetScale = 0;
    if (scrollProgress >= 0.18 && scrollProgress <= 0.55) {
      if (scrollProgress < 0.28) {
        targetScale = (scrollProgress - 0.18) / 0.10; // ramp up
      } else if (scrollProgress > 0.44) {
        targetScale = 1 - (scrollProgress - 0.44) / 0.11; // ramp down
      } else {
        targetScale = 1;
      }
    }
    targetScale = Math.max(0, Math.min(1, targetScale));

    // Smooth lerp scale
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    // Subtle drift position on the right margin of the screen
    const targetY = -0.05 + (scrollProgress - 0.35) * 0.4;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

    // Continuous rotation
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.25;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.05;
    }
    if (moonRef.current) {
      const time = Date.now() * 0.0012;
      moonRef.current.position.x = Math.cos(time) * 0.22;
      moonRef.current.position.z = Math.sin(time) * 0.22;
    }
  });

  return (
    <group ref={groupRef} position={[0.54, -0.05, 0.1]} scale={[0, 0, 0]}>
      {/* ── Central Planet Body ── */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[0.11, 48, 48]} />
        <meshStandardMaterial
          map={planetTexture ?? undefined}
          color="#c084fc"
          roughness={0.65}
          metalness={0.25}
          emissive="#3b0764"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ── Soft Atmospheric Rim Glow ── */}
      <mesh scale={[1.08, 1.08, 1.08]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Tilted Ring System ── */}
      <mesh ref={ringsRef} rotation={[1.15, 0.35, 0.2]}>
        <ringGeometry args={[0.14, 0.24, 64]} />
        <meshBasicMaterial
          map={ringTexture ?? undefined}
          color="#e9d5ff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* ── Orbiting Tiny Satellite Moon ── */}
      <mesh ref={moonRef} position={[0.22, 0.02, 0]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#00f0ff" roughness={0.4} emissive="#00f0ff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/**
 * 3D Oceanic Terrestrial World with Corona (Active around GitHub, LeetCode, Experience: ~0.48 to 0.78)
 */
export function CelestialOceanWorld({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const earthTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createEarthLikeTexture();
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Active range: ~0.48 to 0.78
    let targetScale = 0;
    if (scrollProgress >= 0.46 && scrollProgress <= 0.78) {
      if (scrollProgress < 0.55) {
        targetScale = (scrollProgress - 0.46) / 0.09;
      } else if (scrollProgress > 0.69) {
        targetScale = 1 - (scrollProgress - 0.69) / 0.09;
      } else {
        targetScale = 1;
      }
    }
    targetScale = Math.max(0, Math.min(1, targetScale));

    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    const targetY = 0.05 - (scrollProgress - 0.60) * 0.35;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.22;
    }
    if (beaconRef.current) {
      const time = Date.now() * 0.0015;
      beaconRef.current.position.x = Math.cos(time) * 0.16;
      beaconRef.current.position.y = Math.sin(time) * 0.08;
      beaconRef.current.position.z = Math.sin(time) * 0.16;
    }
  });

  return (
    <group ref={groupRef} position={[-0.52, 0.05, 0.12]} scale={[0, 0, 0]}>
      {/* ── Main Ocean Sphere ── */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[0.095, 48, 48]} />
        <meshStandardMaterial
          map={earthTexture ?? undefined}
          color="#38bdf8"
          roughness={0.5}
          metalness={0.15}
          emissive="#0284c7"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* ── Cyan Atmospheric Corona Halo ── */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Orbit Line Track ── */}
      <mesh rotation={[Math.PI / 3, 0.2, 0]}>
        <torusGeometry args={[0.16, 0.001, 16, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.25} />
      </mesh>

      {/* ── Orbiting Beacon Probe ── */}
      <mesh ref={beaconRef} position={[0.16, 0, 0]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#00f0ff" emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

/**
 * 3D Cosmic Nebula & Interstellar Dust Vortex (Active near Footer: ~0.72 to 1.0)
 */
export function CelestialDeepNebula({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 240 glowing stardust points in a gentle cosmic helix
  const { positions, colors } = useMemo(() => {
    const count = 240;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#7042f8"),
      new THREE.Color("#00f0ff"),
      new THREE.Color("#c084fc"),
      new THREE.Color("#38bdf8")
    ];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 6;
      const radius = 0.15 + Math.random() * 0.35;
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = ((i / count) - 0.5) * 0.6 + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.1;

      const chosen = palette[i % palette.length];
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Active when scrolled down towards contact & footer: ~0.70 to 1.0
    let targetScale = 0;
    if (scrollProgress >= 0.70) {
      targetScale = Math.min(1, (scrollProgress - 0.70) / 0.12);
    }

    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.z += delta * 0.06;
  });

  return (
    <group ref={groupRef} position={[0.45, -0.15, 0.05]} scale={[0, 0, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.007}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * Dynamic Shooting Star / Meteor Streaks that dart across the sky when scrolling down
 */
export function ShootingMeteors({ scrollProgress }: { scrollProgress: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const meteorState = useRef({
    active: false,
    x: 0,
    y: 0,
    z: 0.1,
    vx: -0.04,
    vy: -0.02,
    life: 0,
    maxLife: 40
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 0.12, 0.06, 0]);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame(() => {
    if (!lineRef.current) return;

    // Only trigger meteors below Encryption (scrollProgress > 0.22)
    if (scrollProgress < 0.22) {
      lineRef.current.visible = false;
      return;
    }

    const state = meteorState.current;
    if (!state.active) {
      // Random chance to launch meteor
      if (Math.random() < 0.015) {
        state.active = true;
        state.x = 0.5 + Math.random() * 0.4;
        state.y = 0.3 + Math.random() * 0.3;
        state.vx = -0.025 - Math.random() * 0.02;
        state.vy = -0.015 - Math.random() * 0.015;
        state.life = 0;
        state.maxLife = 25 + Math.floor(Math.random() * 20);
        lineRef.current.visible = true;
      } else {
        lineRef.current.visible = false;
      }
    } else {
      state.x += state.vx;
      state.y += state.vy;
      state.life++;

      lineRef.current.position.set(state.x, state.y, state.z);

      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      if (mat) {
        const progress = state.life / state.maxLife;
        mat.opacity = Math.sin(progress * Math.PI) * 0.85;
      }

      if (state.life >= state.maxLife) {
        state.active = false;
        lineRef.current.visible = false;
      }
    }
  });

  return (
    <primitive
      object={
        new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({
            color: new THREE.Color("#00f0ff"),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            linewidth: 2
          })
        )
      }
      ref={lineRef}
      visible={false}
    />
  );
}
