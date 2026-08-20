"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const BASE_SPEED = 0.5;
const HOVER_SPEED = 2.2;

function Gem({
  color,
  hovered,
  reduced
}: {
  color: string;
  hovered: boolean;
  reduced: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    if (!mesh.current) return;
    const speed = hovered ? HOVER_SPEED : BASE_SPEED;
    mesh.current.rotation.y += delta * speed;
    mesh.current.rotation.x += delta * speed * 0.35;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 0]} />
      <MeshDistortMaterial
        color={color}
        distort={0.3}
        speed={reduced ? 0 : 2}
        roughness={0.2}
        metalness={0.55}
      />
    </mesh>
  );
}

export type SkillBadge3DProps = {
  color?: string;
  size?: number;
};

export default function SkillBadge3D({
  color = "#7c5cff",
  size = 80
}: SkillBadge3DProps) {
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className="shrink-0"
      style={{ width: size, height: size }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />
        <pointLight position={[-3, -2, 2]} intensity={0.7} color="#38bdf8" />
        <Gem color={color} hovered={hovered} reduced={reduced} />
      </Canvas>
    </div>
  );
}