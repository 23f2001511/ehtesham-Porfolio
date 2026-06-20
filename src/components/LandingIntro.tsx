"use client";

import { useEffect, useRef, useState } from "react";

export default function LandingIntro() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setIsLeaving(true), 2100);
    const removeTimer = window.setTimeout(() => setIsVisible(false), 2750);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canvas || reducedMotion) {
      return;
    }

    const renderCanvas = canvas;
    let cleanup = () => {};

    async function startScene() {
      const THREE = await import("three");

      const renderer = new THREE.WebGLRenderer({
        canvas: renderCanvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      const group = new THREE.Group();
      const clock = new THREE.Clock();

      camera.position.set(0, 0, 6);
      scene.add(group);

      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.35, 2),
        new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          roughness: 0.28,
          metalness: 0.65,
          emissive: 0x062c33,
          emissiveIntensity: 0.65,
          wireframe: true
        })
      );

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.9, 0.025, 10, 120),
        new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.72 })
      );
      ring.rotation.x = Math.PI / 2.6;

      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 170;
      const positions = new Float32Array(particleCount * 3);

      for (let index = 0; index < particleCount; index += 1) {
        const radius = 2.2 + Math.random() * 1.9;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[index * 3 + 2] = radius * Math.cos(phi);
      }

      particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const particles = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({
          color: 0xfbbf24,
          size: 0.025,
          transparent: true,
          opacity: 0.8
        })
      );

      group.add(core, ring, particles);
      scene.add(new THREE.AmbientLight(0x8bdcf0, 1.6));

      const keyLight = new THREE.PointLight(0x22d3ee, 16, 12);
      keyLight.position.set(2.5, 2.5, 4);
      scene.add(keyLight);

      let frameId = 0;
      let disposed = false;

      function resize() {
        const size = Math.min(window.innerWidth, window.innerHeight, 620);
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(size, size, false);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      }

      function animate() {
        if (disposed) {
          return;
        }

        const elapsed = clock.getElapsedTime();
        group.rotation.y = elapsed * 0.78;
        group.rotation.x = Math.sin(elapsed * 0.55) * 0.24;
        core.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.035);
        ring.rotation.z = elapsed * 1.25;
        particles.rotation.y = -elapsed * 0.22;

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(animate);
      }

      resize();
      animate();
      window.addEventListener("resize", resize);

      cleanup = () => {
        disposed = true;
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        core.geometry.dispose();
        ring.geometry.dispose();
        particlesGeometry.dispose();
        core.material.dispose();
        ring.material.dispose();
        particles.material.dispose();
        renderer.dispose();
      };
    }

    startScene().catch(() => {
      cleanup = () => {};
    });

    return () => cleanup();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#05070d] transition-opacity duration-700 ${
        isLeaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-label="Opening portfolio"
      role="status"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(34,211,238,0.2),transparent_22rem),linear-gradient(135deg,rgba(16,185,129,0.16),transparent_45%,rgba(251,191,36,0.1))]" />
      <div className="absolute inset-0 noise-mask opacity-35" />

      <div className="relative grid place-items-center">
        <canvas
          ref={canvasRef}
          className="h-[min(72vw,560px)] w-[min(72vw,560px)]"
          width={560}
          height={560}
          aria-hidden="true"
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-20 w-20 place-items-center rounded-full border border-cyan-200/35 bg-black/30 text-xl font-black text-cyan-50 shadow-[0_0_80px_rgba(34,211,238,0.25)] backdrop-blur-md">
            EA
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 w-min -translate-x-1/2 text-center">
        <p className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100">
          Initializing
        </p>
        <div className="mt-3 h-1 w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full origin-left animate-[intro-progress_2s_ease-out_forwards] rounded-full bg-cyan-200" />
        </div>
      </div>
    </div>
  );
}
