"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Cpu, Sparkles } from "lucide-react";
import Reveal from "@/components/shared/Reveal";

export default function EncryptionSection() {
  return (
    <section id="encryption" className="relative z-10 py-24 overflow-hidden">
      {/* ── Ambient Encryption Background Video (Sanidhyy Signature) ── */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center opacity-40">
        <video
          className="w-full h-auto min-h-full object-cover"
          playsInline
          loop
          muted
          autoPlay
        >
          <source src="/videos/encryption-bg.webm" type="video/webm" />
        </video>
      </div>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7042f8]/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="section-shell">
        <div className="text-center mb-16">
          <div className="welcome-box mb-4">
            <Sparkles className="w-4 h-4 text-[#00f0ff]" />
            <span className="welcome-text font-bold">Performance &amp; Security</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Enterprise Architecture &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-400">
              Encryption
            </span>
          </h2>

          <p className="cursive mt-3 text-lg sm:text-xl font-medium text-gray-300">
            Engineered with zero-trust security &amp; sub-millisecond edge response
          </p>
        </div>

        {/* Center Cyber Lock Centerpiece (Sanidhyy Interactive Lock) */}
        <div className="relative mx-auto my-12 flex flex-col items-center justify-center">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <Image
              src="/lock-top.png"
              alt="Lock Top"
              width={56}
              height={56}
              className="translate-y-6 transition-all duration-300 group-hover:translate-y-12 drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]"
            />
            <Image
              src="/lock-main.png"
              alt="Lock Main"
              width={76}
              height={76}
              className="z-10 drop-shadow-[0_0_25px_rgba(112,66,248,0.8)]"
            />
          </motion.div>

          <div className="welcome-box mt-8 bg-[#07011d]/90 border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <span className="welcome-text text-[#00f0ff]">
              End-to-End Cryptographic Assurance
            </span>
          </div>
        </div>

        {/* Architecture Triad Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Reveal delay={0.1}>
            <div className="space-card p-6 h-full border-[#7042f8]/35 bg-[#07011d]/85 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#7042f8]/50 bg-purple-950/40 text-[#00f0ff] mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Zero-Trust Authentication</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Cryptographically secure sessions with bcryptjs hashing, HTTP-only JWT cookies, and strict CORS policies preventing CSRF and XSS.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="space-card p-6 h-full border-[#7042f8]/35 bg-[#07011d]/85 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00f0ff]/50 bg-cyan-950/40 text-[#00f0ff] mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sub-Millisecond Edge</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Next.js 15 App Router with hybrid SSR and incremental static regeneration (ISR) delivering instant first-contentful paint across global CDNs.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="space-card p-6 h-full border-[#7042f8]/35 bg-[#07011d]/85 flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/50 bg-purple-950/40 text-[#c084fc] mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Data Integrity &amp; Schemas</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Strict Zod runtime validations paired with strongly typed Mongoose ODM models guaranteeing zero payload corruption or runtime leakage.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
