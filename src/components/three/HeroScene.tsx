"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Ultra-realistic interactive 3D centerpiece.
 * Features:
 * - Dynamic PBR materials with realistic specular reflection and metallic sheen
 * - Triple concentric gimbal orbital rings rotating at independent speeds
 * - Orbiting tech node satellites with real-time moving light sources
 * - Interactive 360° mouse & touch drag-to-rotate with smooth inertial damping
 * - Cursor parallax tracking & floating levitation physics
 * - Nebula stardust particle constellation
 * - Fully optimized 60fps WebGL rendering with clean resource disposal
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ─── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    // ─── Scene & Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a192f, 0.04);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    // ─── Master Container ────────────────────────────────────────────────────
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // ─── Realistic Multi-Point Studio Lighting ───────────────────────────────
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x0f2942, 1.2);
    scene.add(ambientLight);

    // Key directional light (cool cyan-white)
    const keyLight = new THREE.DirectionalLight(0xe0f7ff, 2.5);
    keyLight.position.set(7, 9, 8);
    scene.add(keyLight);

    // Teal accent light (left-front)
    const tealPoint = new THREE.PointLight(0x64ffda, 3.2, 28);
    tealPoint.position.set(4, 3, 4);
    scene.add(tealPoint);

    // Rim backlight (neon purple/magenta for dramatic edge contrast)
    const rimPoint = new THREE.PointLight(0xbd34fe, 2.6, 26);
    rimPoint.position.set(-6, -2, -5);
    scene.add(rimPoint);

    // Deep blue bottom bounce light
    const bottomLight = new THREE.PointLight(0x1d4ed8, 1.8, 20);
    bottomLight.position.set(0, -6, 2);
    scene.add(bottomLight);

    // ─── Central Hyper-Realistic Crystal Core ────────────────────────────────
    // Polyhedral geodesic icosahedron core
    const coreGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x071b2f,
      emissive: new THREE.Color(0x0f3e6d),
      emissiveIntensity: 0.45,
      metalness: 0.88,
      roughness: 0.18,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Glowing crystalline wireframe lattice
    const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.68, 1));
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    masterGroup.add(wireMesh);

    // Inner pulsating energy octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x64ffda,
      emissive: new THREE.Color(0x64ffda),
      emissiveIntensity: 0.85,
      metalness: 0.3,
      roughness: 0.1,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    masterGroup.add(innerMesh);

    // ─── Triple Concentric Gimbal Orbital Rings ───────────────────────────────
    // Ring 1 (Primary Cyan Gyro Ring)
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x64ffda,
      emissive: new THREE.Color(0x64ffda),
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.15,
    });
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.7, 0.022, 16, 160),
      ring1Mat
    );
    ring1.rotation.x = Math.PI / 2.3;
    masterGroup.add(ring1);

    // Ring 2 (Secondary Indigo Ring, perpendicular tilt)
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: new THREE.Color(0x6366f1),
      emissiveIntensity: 0.3,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.018, 16, 160),
      ring2Mat
    );
    ring2.rotation.y = Math.PI / 3.2;
    ring2.rotation.z = Math.PI / 4;
    masterGroup.add(ring2);

    // Ring 3 (Outer Wide Horizon Ring)
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(3.9, 0.012, 12, 180),
      ring3Mat
    );
    ring3.rotation.x = Math.PI / 1.85;
    masterGroup.add(ring3);

    // ─── Orbiting Node Satellites (Representing Tech Stack) ───────────────────
    const satelliteNodes: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; yOffset: number; light?: THREE.PointLight }[] = [];
    const satelliteColors = [0x64ffda, 0x38bdf8, 0x818cf8, 0xa78bfa, 0x34d399, 0xf472b6];

    for (let i = 0; i < 6; i++) {
      const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: satelliteColors[i],
        emissive: new THREE.Color(satelliteColors[i]),
        emissiveIntensity: 0.9,
        metalness: 0.6,
        roughness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);

      // Attach a tiny point light to 2 of the satellites for realistic light casting
      let satLight: THREE.PointLight | undefined;
      if (i % 2 === 0) {
        satLight = new THREE.PointLight(satelliteColors[i], 1.2, 5);
        satMesh.add(satLight);
      }

      masterGroup.add(satMesh);
      satelliteNodes.push({
        mesh: satMesh,
        angle: (i / 6) * Math.PI * 2,
        speed: 0.3 + (i % 3) * 0.1,
        radius: 2.7 + (i % 3) * 0.6,
        yOffset: Math.sin(i * 1.5) * 0.8,
        light: satLight,
      });
    }

    // ─── Ambient Stardust Particle Field ─────────────────────────────────────
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 26;
      positions[idx + 1] = (Math.random() - 0.5) * 16;
      positions[idx + 2] = (Math.random() - 0.5) * 14 - 2;

      // Subtle cyan/indigo tint
      if (Math.random() > 0.5) {
        particleColors[idx] = 0.39; // R
        particleColors[idx + 1] = 1.0; // G
        particleColors[idx + 2] = 0.85; // B
      } else {
        particleColors[idx] = 0.5;
        particleColors[idx + 1] = 0.6;
        particleColors[idx + 2] = 1.0;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ─── Dynamic Interactive Drag-to-Rotate & Inertial Physics ───────────────
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    const targetParallax = { x: 0, y: 0 };
    const currentParallax = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetParallax.x = normX * 0.7;
      targetParallax.y = normY * 0.4;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        velocityX = deltaX * 0.006;
        velocityY = deltaY * 0.006;

        masterGroup.rotation.y += velocityX;
        masterGroup.rotation.x += velocityY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // ─── Auto-Resize Handling ────────────────────────────────────────────────
    const handleResize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // ─── Animation Loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        // Continuous organic base rotation if not dragging
        if (!isDragging) {
          // Apply residual inertial velocity
          masterGroup.rotation.y += velocityX;
          masterGroup.rotation.x += velocityY;
          velocityX *= 0.94;
          velocityY *= 0.94;

          // Gentle continuous idle spin
          masterGroup.rotation.y += delta * 0.14;
        }

        // Inner core rotation with slight counter-spin for depth
        coreMesh.rotation.x = t * 0.12;
        coreMesh.rotation.y = t * 0.18;
        wireMesh.rotation.copy(coreMesh.rotation);
        innerMesh.rotation.x = -t * 0.25;
        innerMesh.rotation.y = -t * 0.35;

        // Individual orbital ring dynamics
        ring1.rotation.z = t * 0.18;
        ring2.rotation.z = -t * 0.12;
        ring3.rotation.z = t * 0.08;

        // Satellite movement along realistic orbits
        satelliteNodes.forEach((node) => {
          node.angle += delta * node.speed;
          node.mesh.position.x = Math.cos(node.angle) * node.radius;
          node.mesh.position.z = Math.sin(node.angle) * node.radius;
          node.mesh.position.y = node.yOffset + Math.sin(t * 1.8 + node.angle) * 0.25;
        });

        // Floating particles drift
        particles.rotation.y = t * 0.025;

        // Smooth camera parallax drift
        currentParallax.x += (targetParallax.x - currentParallax.x) * 0.05;
        currentParallax.y += (targetParallax.y - currentParallax.y) * 0.05;
        camera.position.x = currentParallax.x + Math.sin(t * 0.2) * 0.15;
        camera.position.y = 0.5 + currentParallax.y + Math.cos(t * 0.25) * 0.1;
      }

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate in 3D"
      />

      {/* Interactive 3D Rotation Hint Badge */}
      <div
        className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-primary/25 bg-surface/80 px-3.5 py-1 text-[11px] font-mono tracking-wider text-primary backdrop-blur-md transition-opacity duration-300 ${
          isInteracting ? "opacity-30" : "opacity-90 animate-pulse"
        }`}
      >
        ✨ 3D INTERACTIVE · DRAG TO ROTATE
      </div>
    </div>
  );
}
