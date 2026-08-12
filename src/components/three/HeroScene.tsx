"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Abstract engineering sculpture for the hero: a softly-lit crystalline core
 * ringed by a fine orbital lattice and a sparse particle field. Designed to read
 * as an intentional technical object — not a "computer" — with realistic depth
 * (key + fill + rim lighting, fog, and a fake contact glow), eased pointer
 * parallax, and a gentle idle drift. Kept deliberately low-poly and small so it
 * never blocks first paint. Honors prefers-reduced-motion.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x070a0f, 9, 24);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 1.0, 10.2);

    // ── Lighting: key + accent fill + rim for depth ─────────────────────────
    scene.add(new THREE.AmbientLight(0x8696b8, 0.7));
    const key = new THREE.DirectionalLight(0xcfe0ff, 1.5);
    key.position.set(6, 9, 6);
    scene.add(key);
    const accentPoint = new THREE.PointLight(0x4f9cff, 1.4, 30);
    accentPoint.position.set(3.8, 3.2, 3.2);
    scene.add(accentPoint);
    const rim = new THREE.PointLight(0x8b7bff, 0.7, 26);
    rim.position.set(-5.0, 2.4, -3.4);
    scene.add(rim);
    const tealFill = new THREE.PointLight(0x2dd4bf, 0.35, 24);
    tealFill.position.set(-2.0, -3.0, 4.0);
    scene.add(tealFill);

    const group = new THREE.Group();
    scene.add(group);

    // ── Core: faceted crystal (icosahedron), softly emissive ────────────────
    const coreGeo = new THREE.IcosahedronGeometry(1.72, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0d1626,
      emissive: new THREE.Color(0x2b5cff),
      emissiveIntensity: 0.28,
      metalness: 0.65,
      roughness: 0.28,
      flatShading: true
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // crisp edge lattice over the core
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x6ea8ff, transparent: true, opacity: 0.55 });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(coreGeo), edgeMat);
    group.add(edges);

    // faint outer halo shell for depth
    const halo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.25, 1),
      new THREE.MeshBasicMaterial({ color: 0x4f9cff, wireframe: true, transparent: true, opacity: 0.08 })
    );
    group.add(halo);

    // ── Orbital rings (thin, elegant) ───────────────────────────────────────
    const ringMatA = new THREE.MeshBasicMaterial({ color: 0x5f8dff, transparent: true, opacity: 0.28 });
    const ringMatB = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.16 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.008, 8, 140), ringMatA);
    ring1.rotation.x = Math.PI / 2.15;
    group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.006, 8, 140), ringMatB);
    ring2.rotation.x = Math.PI / 2.6;
    ring2.rotation.z = 0.5;
    group.add(ring2);

    // ── Orbiting node satellites ────────────────────────────────────────────
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xbcd2ff,
      emissive: new THREE.Color(0x4f9cff),
      emissiveIntensity: 0.5,
      metalness: 0.5,
      roughness: 0.4
    });
    const nodes: THREE.Mesh[] = [];
    const nodeOrbit = new THREE.Group();
    const NODE_COUNT = 8;
    for (let i = 0; i < NODE_COUNT; i += 1) {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 14), nodeMat);
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      node.userData = {
        angle,
        radius: 3.15 + (i % 2) * 0.55,
        speed: 0.16 + (i % 3) * 0.05,
        y: Math.sin(i * 1.7) * 0.9
      };
      node.position.set(Math.cos(angle) * node.userData.radius, node.userData.y, Math.sin(angle) * node.userData.radius);
      nodes.push(node);
      nodeOrbit.add(node);
    }
    nodeOrbit.rotation.x = Math.PI / 2.15;
    group.add(nodeOrbit);

    // ── Fake contact glow (soft radial shadow / depth anchor) ───────────────
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gctx = glowCanvas.getContext("2d");
    if (gctx) {
      const grad = gctx.createRadialGradient(64, 64, 4, 64, 64, 64);
      grad.addColorStop(0, "rgba(90,150,255,0.55)");
      grad.addColorStop(0.4, "rgba(80,140,255,0.18)");
      grad.addColorStop(1, "rgba(80,140,255,0)");
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, 128, 128);
    }
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0.55 })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -3.4;
    scene.add(glow);

    // ── Sparse particle field (depth atmosphere) ────────────────────────────
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7ea8ff,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Pointer parallax ────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onPointerLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
    };
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    const render = () => {
      if (disposed) return;
      raf = requestAnimationFrame(render);
      const t = clock.getElapsedTime();

      if (!reducedMotion) {
        // slow cinematic rotation of the whole structure
        group.rotation.y = t * 0.12;
        group.position.y = Math.sin(t * 0.5) * 0.12; // gentle bob
        core.rotation.x = t * 0.1;
        core.rotation.y = t * 0.14;
        edges.rotation.copy(core.rotation);
        halo.rotation.y = -t * 0.06;
        halo.rotation.z = t * 0.04;
        ring1.rotation.z = t * 0.1;
        ring2.rotation.z = -t * 0.07;
        nodeOrbit.rotation.z = t * 0.12;
        nodes.forEach((node) => {
          node.userData.angle += node.userData.speed * 0.01;
          node.position.x = Math.cos(node.userData.angle) * node.userData.radius;
          node.position.z = Math.sin(node.userData.angle) * node.userData.radius;
          node.position.y = node.userData.y + Math.sin(t * 0.8 + node.userData.angle) * 0.05;
        });
        particles.rotation.y = t * 0.02;
        particleMat.opacity = 0.42 + Math.sin(t * 1.3) * 0.1;
        glow.material.opacity = 0.45 + Math.sin(t * 0.6) * 0.1;

        // eased camera drift + parallax
        const driftX = Math.sin(t * 0.18) * 0.25;
        const driftY = Math.cos(t * 0.15) * 0.18;
        camera.position.x += (mouse.x * 0.9 + driftX - camera.position.x) * 0.045;
        camera.position.y += (1.0 + mouse.y * 0.55 + driftY - camera.position.y) * 0.045;
      }
      camera.lookAt(0.1, 0.05, 0);
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else if (material) {
          const maybeMap = (material as THREE.Material & { map?: THREE.Texture }).map;
          maybeMap?.dispose();
          material.dispose();
        }
      });
      particleGeo.dispose();
      glowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
