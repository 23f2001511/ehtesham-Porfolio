"use client";

import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles, Environment } from "@react-three/drei";
import { Suspense } from "react";

function AnimatedBlob() {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh scale={1.6}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#7c5cff"
          attach="material"
          distort={0.45}
          speed={2}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} color="#a78bfa" />
        <pointLight position={[-3, -2, -2]} intensity={0.8} color="#38bdf8" />

        <Suspense fallback={null}>
          <AnimatedBlob />
          <Sparkles count={80} scale={6} size={2} speed={0.4} color="#8b5cf6" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
