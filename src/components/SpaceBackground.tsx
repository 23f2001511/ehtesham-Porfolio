"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const SUN_COLOR = "#ffb54d";
const SUN_EMISSIVE = "#ff9d2e";
const STAR_TINTS = ["#ffffff", "#cfe0ff", "#ffeac8"];

/**
 * Far star layer (drei <Stars>) with a very slow independent rotation, so the
 * two star layers move at different speeds for a parallax depth cue.
 */
function FarStarLayer({ count, reduced }: { count: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    if (!group.current) return;
    group.current.rotation.y += delta * 0.012;
  });

  return (
    <group ref={group}>
      <Stars
        radius={70}
        depth={50}
        count={count}
        factor={3}
        saturation={0.4}
        fade
        speed={0.8}
      />
    </group>
  );
}

/**
 * Denser, closer star layer with per-star color variation (white / pale blue /
 * pale yellow) and faster independent rotation — adds parallax depth vs. far layer.
 */
function NearStarLayer({
  count,
  radius,
  reduced
}: {
  count: number;
  radius: number;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = STAR_TINTS.map((hex) => new THREE.Color(hex));
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2 * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * radius;
      color.copy(palette[i % palette.length]);
      const dim = 0.35 + Math.random() * 0.6;
      colors[i * 3] = color.r * dim;
      colors[i * 3 + 1] = color.g * dim;
      colors[i * 3 + 2] = color.b * dim;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (reduced) return;
    if (group.current) {
      group.current.rotation.y += delta * 0.035;
    }
    // Group-level shimmer: gently pulse the whole field's opacity so it
    // twinkles instead of sitting frozen.
    const material = materialRef.current;
    if (material) {
      material.opacity = 0.6 + 0.3 * Math.sin(state.clock.elapsedTime * 1.8);
    }
  });

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          ref={materialRef}
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/**
 * Faint diagonal "milky way" haze — a large, mostly-transparent gradient plane
 * with additive blending. Kept near-invisible and wide so it reads as ambient
 * dust, not a beam. Skipped on mobile (full-screen blend cost).
 */
function MilkyWayBand() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, 512, 512);
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "rgba(160, 180, 235, 0)");
    gradient.addColorStop(0.12, "rgba(170, 185, 240, 0.10)");
    gradient.addColorStop(0.5, "rgba(200, 210, 255, 0.18)");
    gradient.addColorStop(0.88, "rgba(170, 185, 240, 0.10)");
    gradient.addColorStop(1, "rgba(160, 180, 235, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
  }, []);

  if (!texture) return null;

  return (
    <mesh rotation={[0.45, 0.9, 0.15]} position={[0, 0, -9]}>
      <planeGeometry args={[44, 22]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/**
 * Soft radial glow rendered as a camera-facing sprite with a warm gradient
 * texture — a clean halo instead of a faceted additive shell.
 */
function GlowSprite({ scale, opacity }: { scale: number; opacity: number }) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 196, 120, 0.95)");
    gradient.addColorStop(0.35, "rgba(255, 166, 84, 0.4)");
    gradient.addColorStop(1, "rgba(255, 166, 84, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);

  if (!texture) return null;

  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

/**
 * Very slow Lissajous camera sway (figure-8-ish). Small amplitude so the
 * whole scene gets a subtle parallax depth without feeling like motion
 * sickness. Freezes entirely under reduced motion.
 */
function CameraDrift({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();

  useFrame((state) => {
    if (reduced) return;
    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.21) * 0.2;
    camera.position.y = Math.sin(time * 0.42) * 0.12;
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/**
 * Instanced asteroid belt — a scattered ring of small rocks that slowly
 * revolves as one body. Instancing keeps ~100+ rocks to a single draw call.
 * Rendered inside the solar-system group so it inherits its tilt and scale.
 */
function AsteroidBelt({ count, reduced }: { count: number; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);

  const rocks = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 3.55 + (Math.random() - 0.5) * 0.55,
        y: (Math.random() - 0.5) * 0.22,
        scale: 0.018 + Math.random() * 0.045,
        tilt: Math.random() * Math.PI
      })),
    [count]
  );

  useEffect(() => {
    if (!mesh.current) return;
    const dummy = new THREE.Object3D();
    rocks.forEach((rock, index) => {
      dummy.position.set(Math.cos(rock.angle) * rock.radius, rock.y, Math.sin(rock.angle) * rock.radius);
      dummy.rotation.set(rock.tilt, rock.tilt * 1.3, 0);
      dummy.scale.setScalar(rock.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [rocks]);

  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#8a7d70" emissive="#2a2118" emissiveIntensity={0.2} roughness={0.9} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}

/**
 * A distant spiral galaxy built from a colored point cloud (violet core →
 * cyan rim, three arms), flattened into a disc and slowly spinning. Sits far
 * behind the scene, opposite the solar system, as the "galaxy" focal point.
 */
function SpiralGalaxy({ count, reduced }: { count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const inner = new THREE.Color("#c4b5fd");
    const outer = new THREE.Color("#22d3ee");
    const color = new THREE.Color();
    const arms = 3;
    const maxRadius = 6;

    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.65) * maxRadius;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spin = radius * 0.55;
      const scatter = (Math.random() - 0.5) * (0.3 + radius * 0.08);
      const angle = armAngle + spin;

      positions[i * 3] = Math.cos(angle) * radius + scatter;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6 * (1 - radius / (maxRadius + 2));
      positions[i * 3 + 2] = Math.sin(angle) * radius + scatter;

      color.copy(inner).lerp(outer, radius / maxRadius);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (reduced || !points.current) return;
    points.current.rotation.y += delta * 0.04;
  });

  return (
    <group position={[-9, 3.4, -16]} rotation={[1.05, 0.35, 0.4]} scale={1.1}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * Shooting stars — a small pool of additive streaks that periodically dart
 * across on a fixed diagonal and fade in/out. Each has its own phase so they
 * don't fire in unison. Positions are looped from absolute elapsed time.
 */
function ShootingStars({ count, reduced }: { count: number; reduced: boolean }) {
  const DIR_X = -1;
  const DIR_Y = -0.62;
  const angle = Math.atan2(DIR_Y, DIR_X);

  const groups = useRef<(THREE.Group | null)[]>([]);
  const meteors = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x0: 7 + Math.random() * 7,
        y0: 3.5 + Math.random() * 5,
        z: -3 - Math.random() * 7,
        length: 16 + Math.random() * 10,
        speed: 0.55 + Math.random() * 0.4,
        phase: Math.random() * 9,
        period: 7 + Math.random() * 7,
        window: 1.1
      })),
    [count]
  );

  useFrame((state) => {
    if (reduced) return;
    const time = state.clock.elapsedTime;
    meteors.forEach((meteor, index) => {
      const node = groups.current[index];
      if (!node) return;
      const local = (time * meteor.speed + meteor.phase) % meteor.period;
      const active = local < meteor.window;
      node.visible = active;
      if (!active) return;
      const progress = local / meteor.window;
      const travel = progress * meteor.length;
      node.position.set(meteor.x0 + DIR_X * travel, meteor.y0 + DIR_Y * travel, meteor.z);
      const streak = node.children[0] as THREE.Mesh;
      const material = streak.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(progress * Math.PI) * 0.9;
    });
  });

  return (
    <group>
      {meteors.map((_, index) => (
        <group
          key={index}
          ref={(node) => {
            groups.current[index] = node;
          }}
          rotation={[0, 0, angle]}
          visible={false}
        >
          <mesh>
            <boxGeometry args={[2.4, 0.025, 0.025]} />
            <meshBasicMaterial
              color="#dbeafe"
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const PHASE_OFFSET = 2.1;

type PlanetConfig = {
  radius: number;
  size: number;
  color: string;
  emissive: string;
  orbitSpeed: number;
  spinSpeed: number;
  ring?: boolean;
};

const PLANETS: PlanetConfig[] = [
  { radius: 1.9, size: 0.32, color: "#b06a4b", emissive: "#7c4326", orbitSpeed: 1.6, spinSpeed: 1.6 },
  { radius: 2.5, size: 0.42, color: "#3f76a8", emissive: "#2a5f8a", orbitSpeed: 1.1, spinSpeed: 1.0 },
  { radius: 3.2, size: 0.27, color: "#8b5cf6", emissive: "#7c5cff", orbitSpeed: 0.75, spinSpeed: 1.4 },
  { radius: 4.0, size: 0.38, color: "#e6e2ee", emissive: "#c9c4d8", orbitSpeed: 0.5, spinSpeed: 0.7, ring: true }
];

/**
 * Small solar system "diorama": a warm emissive sun with a soft halo, a dim
 * point light, and 2-4 planets on real orbital + self-spin motion. Pushed to
 * the top-right corner, far from the center where hero text sits.
 */
function SolarSystem({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const planetRefs = useRef<(THREE.Group | null)[]>([]);
  const planets = mobile ? PLANETS.slice(0, 2) : PLANETS;

  useFrame((state, delta) => {
    if (reduced) return;
    if (!group.current) return;
    const time = state.clock.elapsedTime;

    group.current.rotation.y += delta * 0.03;

    planetRefs.current.forEach((planet, index) => {
      const config = planets[index];
      if (!planet || !config) return;
      const angle = time * config.orbitSpeed + index * PHASE_OFFSET;
      planet.position.set(Math.cos(angle) * config.radius, 0, Math.sin(angle) * config.radius);
      planet.rotation.y += delta * config.spinSpeed;
    });
  });

  return (
    <group ref={group} position={[5.4, 2.6, -6]} scale={0.6} rotation={[0.45, 0, 0]}>
      {/* Sun */}
      <mesh>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#a35b1c"
          emissive={SUN_EMISSIVE}
          emissiveIntensity={2.2}
          roughness={0.4}
        />
      </mesh>
      {/* Soft warm glow (camera-facing gradient sprite) */}
      <GlowSprite scale={3.2} opacity={0.6} />
      <Sparkles count={mobile ? 6 : 10} scale={2.2} size={1.5} speed={0.5} opacity={0.3} color={SUN_COLOR} />
      <pointLight color={SUN_EMISSIVE} intensity={2.2} distance={12} decay={2} />

      {/* Faint orbit paths (static, in the orbital plane) */}
      {planets.map((planet, index) => (
        <mesh key={`orbit-${index}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.radius - 0.012, planet.radius + 0.012, 128]} />
          <meshBasicMaterial
            color="#7c6bd6"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Asteroid belt between the inner planets and the ringed outer planet */}
      {!mobile ? <AsteroidBelt count={110} reduced={reduced} /> : null}

      {/* Planets */}
      {planets.map((planet, index) => {
        const phase = index * PHASE_OFFSET;
        const initialPosition: [number, number, number] = [
          Math.cos(phase) * planet.radius,
          0,
          Math.sin(phase) * planet.radius
        ];
        return (
          <group
            key={index}
            ref={(node) => {
              planetRefs.current[index] = node;
            }}
            position={initialPosition}
            scale={planet.size}
          >
            <mesh>
              <icosahedronGeometry args={[1, 2]} />
              <meshStandardMaterial
                color={planet.color}
                emissive={planet.emissive}
                emissiveIntensity={0.12}
                roughness={0.55}
                metalness={0.2}
              />
            </mesh>
            {planet.ring ? (
              <>
                <mesh rotation={[Math.PI / 2.1, 0.4, 0]}>
                  <ringGeometry args={[1.3, 1.9, 32]} />
                  <meshBasicMaterial
                    color="#d8d2e8"
                    transparent
                    opacity={0.55}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                  />
                </mesh>
                {/* moon — revolves with the planet's self-rotation */}
                <mesh position={[2.5, 0, 0]} scale={0.24}>
                  <icosahedronGeometry args={[1, 1]} />
                  <meshStandardMaterial
                    color="#cfc9dc"
                    emissive="#39344f"
                    emissiveIntensity={0.15}
                    roughness={0.85}
                    metalness={0.1}
                  />
                </mesh>
              </>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

export default function SpaceBackground() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    setIsMobile(media.matches);
    setIsLight(document.documentElement.classList.contains("light"));
    setMounted(true);

    const onMediaChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener("change", onMediaChange);

    const html = document.documentElement;
    const onThemeChange = () => setIsLight(html.classList.contains("light"));
    const observer = new MutationObserver(onThemeChange);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      media.removeEventListener("change", onMediaChange);
      observer.disconnect();
    };
  }, []);

  // No background on admin; none in light theme (dark galaxy on a light page
  // would look broken); nothing renders before mount (SSR safety).
  if (!mounted || pathname.startsWith("/admin") || isLight) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced ? undefined : { opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <Canvas
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[-4, 3, 2]} intensity={1.1} color="#cfe0ff" />
        <CameraDrift reduced={reduced} />
        <FarStarLayer count={isMobile ? 350 : 1500} reduced={reduced} />
        <NearStarLayer count={isMobile ? 130 : 800} radius={12} reduced={reduced} />
        {!isMobile ? <MilkyWayBand /> : null}
        {!isMobile ? <SpiralGalaxy count={2200} reduced={reduced} /> : null}
        {!isMobile ? <ShootingStars count={3} reduced={reduced} /> : null}
        <SolarSystem reduced={reduced} mobile={isMobile} />
      </Canvas>
    </motion.div>
  );
}
