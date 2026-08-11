"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneHotspot = { appId: string; label: string };

type Props = {
  accent: string;
  hotspots: SceneHotspot[];
  onHotspotClick: (appId: string) => void;
  onHotspotHover: (hotspot: SceneHotspot | null) => void;
  interactive: boolean;
};

const HOTSPOT_META: Record<string, { color: string; abbr: string }> = {
  projects: { color: "#8b5cf6", abbr: "PR" },
  github: { color: "#94a3b8", abbr: "GH" },
  leetcode: { color: "#fbbf24", abbr: "LC" },
  terminal: { color: "#22d3ee", abbr: "TM" },
  contact: { color: "#34d399", abbr: "MA" },
  about: { color: "#38bdf8", abbr: "ME" }
};

function roundedLabelTexture(abbr: string, color: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    const r = size * 0.22;
    ctx.beginPath();
    // rounded rect
    ctx.moveTo(r, 4);
    ctx.lineTo(size - r, 4);
    ctx.quadraticCurveTo(size - 4, 4, size - 4, r);
    ctx.lineTo(size - 4, size - r);
    ctx.quadraticCurveTo(size - 4, size - 4, size - r, size - 4);
    ctx.lineTo(r, size - 4);
    ctx.quadraticCurveTo(4, size - 4, 4, size - r);
    ctx.lineTo(4, r);
    ctx.quadraticCurveTo(4, 4, r, 4);
    ctx.closePath();
    ctx.fillStyle = "rgba(10, 16, 26, 0.92)";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.round(size * 0.4)}px ui-monospace, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(abbr, size / 2, size / 2 + 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

// The Scene component (this file) is only imported client-side via next/dynamic.
export default function Workstation3DScene({
  accent,
  hotspots,
  onHotspotClick,
  onHotspotHover,
  interactive
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const clickRef = useRef(onHotspotClick);
  const hoverRef = useRef(onHotspotHover);
  const interactiveRef = useRef(interactive);
  clickRef.current = onHotspotClick;
  hoverRef.current = onHotspotHover;
  interactiveRef.current = interactive;

  // Keep the live accent/color in refs so the render loop reads fresh values.
  const accentRef = useRef(accent);
  accentRef.current = accent;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    let raf = 0;
    let disposed = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05070d, 9, 20);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 1.5, 9.2);

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x8899bb, 0.7));
    const key = new THREE.DirectionalLight(0xbfd4ff, 1.1);
    key.position.set(5, 8, 6);
    scene.add(key);
    const accentLight = new THREE.PointLight(0x22d3ee, 0.9, 30);
    accentLight.position.set(3.2, 3.4, 3.2);
    scene.add(accentLight);
    const fillLight = new THREE.PointLight(0x8b5cf6, 0.4, 24);
    fillLight.position.set(-4, 2.5, 2);
    scene.add(fillLight);

    // ── Workspace group (right-of-centre so the hero can sit left) ──
    const workspace = new THREE.Group();
    workspace.position.set(2.3, -0.4, 0);
    workspace.rotation.y = 0.18;
    scene.add(workspace);

    const metalDark = new THREE.MeshStandardMaterial({
      color: 0x151c28,
      metalness: 0.55,
      roughness: 0.5
    });
    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x0b1119,
      metalness: 0.35,
      roughness: 0.6
    });

    // Desk surface
    const desk = new THREE.Mesh(
      new THREE.CylinderGeometry(3.4, 3.4, 0.1, 48, 1, false, 0, Math.PI * 2),
      metalDark.clone()
    );
    (desk.material as THREE.MeshStandardMaterial).color.set(0x0e141d);
    desk.scale.set(1, 1, 0.5);
    desk.position.set(0, -1.2, 0.2);
    workspace.add(desk);

    // Monitor: stand + bezel + glowing screen
    const monitor = new THREE.Group();
    monitor.position.set(0, 0.1, -0.4);
    workspace.add(monitor);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 0.22), metalDark);
    stand.position.set(0, -0.7, -0.3);
    monitor.add(stand);
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.6), metalDark);
    base.position.set(0, -1.22, -0.3);
    monitor.add(base);
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.95, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x0a0f16, metalness: 0.6, roughness: 0.35 })
    );
    monitor.add(bezel);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x0a1420,
      emissive: new THREE.Color(accentRef.current),
      emissiveIntensity: 0.55,
      metalness: 0.1,
      roughness: 0.4
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.75), screenMat);
    screen.position.set(0, 0, 0.065);
    monitor.add(screen);
    // code lines on screen
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.55 });
    for (let i = 0; i < 9; i += 1) {
      const w = 0.5 + Math.abs(Math.sin(i * 1.7)) * 1.7;
      const ln = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.05), lineMat);
      ln.position.set(-1.35 + w / 2, 0.72 - i * 0.17, 0.075);
      monitor.add(ln);
    }

    // Keyboard
    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.85), keyMat);
    keyboard.position.set(0, -1.1, 1.5);
    keyboard.rotation.x = -0.04;
    workspace.add(keyboard);
    const keycapMat = new THREE.MeshStandardMaterial({ color: 0x1c2632, roughness: 0.5, metalness: 0.3 });
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 11; col += 1) {
        const cap = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.16), keycapMat);
        cap.position.set(-1.05 + col * 0.21, -1.02, 1.2 + row * 0.24);
        workspace.add(cap);
      }
    }

    // ── Floating project / app nodes ─────────────────────────
    const nodes: THREE.Sprite[] = [];
    const nodeDefs = hotspots.map((hotspot) => {
      const meta = HOTSPOT_META[hotspot.appId] ?? { color: accentRef.current, abbr: hotspot.appId.slice(0, 2).toUpperCase() };
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: roundedLabelTexture(meta.abbr, meta.color),
          transparent: true,
          depthWrite: false
        })
      );
      sprite.scale.set(0.85, 0.85, 1);
      (sprite as unknown as { appId: string; label: string; baseY: number; phase: number }).appId =
        hotspot.appId;
      (sprite as unknown as { label: string }).label = hotspot.label;
      nodes.push(sprite);
      workspace.add(sprite);
      return sprite as unknown as { appId: string; label: string; baseY: number; phase: number } & THREE.Sprite;
    });

    nodeDefs.forEach((node, index) => {
      const angle = (index / Math.max(1, nodeDefs.length)) * Math.PI * 2 + Math.PI / 5;
      const radius = 3.0;
      node.position.set(Math.cos(angle) * radius, 0.9 + Math.sin(index * 1.3) * 0.55, Math.sin(angle) * radius * 0.55 - 0.3);
      node.baseY = node.position.y;
      node.phase = Math.random() * Math.PI * 2;
    });

    // ── Particles ────────────────────────────────────────────
    const particleCount = 260;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(accentRef.current),
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ── Interaction (raycast) ────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-2, -2);
    let hovered: typeof nodeDefs[number] | null = null;
    const mouse = { x: 0, y: 0 };

    const setHovered = (node: typeof nodeDefs[number] | null) => {
      if (node === hovered) {
        return;
      }
      hovered = node;
      hoverRef.current(node ? { appId: node.appId, label: node.label } : null);
      mount.style.cursor = node ? "pointer" : "default";
    };

    const pick = (): typeof nodeDefs[number] | null => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(nodes, false);
      return (hits[0]?.object as typeof nodeDefs[number]) ?? null;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.x = pointer.x;
      mouse.y = pointer.y;
      if (interactiveRef.current) {
        setHovered(pick());
      }
    };

    const onPointerLeave = () => {
      pointer.set(-2, -2);
      setHovered(null);
    };

    const onClick = () => {
      if (interactiveRef.current && hovered) {
        clickRef.current(hovered.appId);
      }
    };

    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerleave", onPointerLeave);
    mount.addEventListener("click", onClick);

    // ── Resize ───────────────────────────────────────────────
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

    // ── Render loop ──────────────────────────────────────────
    const clock = new THREE.Clock();
    const render = () => {
      if (disposed) {
        return;
      }
      raf = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // live accent follow
      const accentColor = new THREE.Color(accentRef.current);
      accentLight.color.copy(accentColor);
      particleMaterial.color.copy(accentColor);
      screenMat.emissive.copy(accentColor);
      screenMat.emissiveIntensity = 0.4 + Math.sin(elapsed * 2) * 0.12;

      if (!reducedMotion) {
        // camera parallax toward pointer
        const targetX = 0 + mouse.x * 0.7;
        const targetY = 1.5 + mouse.y * 0.45;
        camera.position.x += (targetX - camera.position.x) * 0.04;
        camera.position.y += (targetY - camera.position.y) * 0.04;
        camera.lookAt(0.9, 0.1, 0);

        nodeDefs.forEach((node) => {
          node.position.y = node.baseY + Math.sin(elapsed * 1.1 + node.phase) * 0.14;
          const isActive = interactiveRef.current && node === hovered;
          const target = isActive ? 1.15 : 0.85;
          node.scale.x += (target - node.scale.x) * 0.15;
          node.scale.y += (target - node.scale.y) * 0.15;
        });

        particles.rotation.y = elapsed * 0.02;
        workspace.position.y = -0.4 + Math.sin(elapsed * 0.6) * 0.05;
      } else {
        camera.lookAt(0.9, 0.1, 0);
      }

      renderer.render(scene, camera);
    };
    render();

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerleave", onPointerLeave);
      mount.removeEventListener("click", onClick);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        const material = (mesh as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) {
          material.forEach((m) => m.dispose());
        } else if (material) {
          const maybeMap = (material as THREE.Material & { map?: THREE.Texture }).map;
          maybeMap?.dispose();
          material.dispose();
        }
      });
      particleGeometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [hotspots]);

  return <div ref={mountRef} className="os-3d-scene" aria-hidden="true" />;
}
