"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackCertificates } from "@/constants";
import { formatDate } from "@/lib/utils";
import { useCollection } from "@/hooks/useCollection";
import type { Certificate } from "@/types";

export default function CertificatesSection() {
  const { data: certificates, isLoading, error } = useCollection<Certificate>(
    "/api/certificates",
    fallbackCertificates
  );

  return (
    <section id="certificates" className="py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certificates"
          title="Learning made visible through credentials and applied practice."
          description="Certificates are useful when they support real work. This section keeps both the credential and the learning context easy to scan."
        />

        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live certificates could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-72" />
            ))}
          </div>
        ) : certificates.length ? (
          <div className="grid gap-5 md:grid-cols-3">
            {certificates.map((certificate, index) => (
              <Reveal key={`${certificate.title}-${certificate.issuer}`} delay={index * 0.05}>
                <article className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.07]">
                  <div className="relative aspect-[16/10] bg-slate-900">
                    {certificate.imageUrl ? (
                      <Image
                        src={certificate.imageUrl}
                        alt={`${certificate.title} certificate`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[linear-gradient(135deg,rgba(251,191,36,0.16),rgba(34,211,238,0.12),rgba(16,185,129,0.1))]">
                        <Award className="h-10 w-10 text-amber-100" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone={certificate.featured ? "amber" : "slate"}>
                        {certificate.featured ? "Featured" : formatDate(certificate.issueDate)}
                      </Badge>
                      {certificate.credentialUrl ? (
                        <Link
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="grid h-9 w-9 place-items-center rounded-md border border-border bg-white/5 text-slate-200 transition hover:border-cyan-300/60 hover:text-white"
                          aria-label={`Open credential for ${certificate.title}`}
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-lg font-black text-white">{certificate.title}</h3>
                    <p className="mt-2 text-sm font-semibold text-cyan-100">{certificate.issuer}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{formatDate(certificate.issueDate)}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No certificates published yet"
            description="Add certificates from the admin dashboard to populate this section."
          />
        )}
      </div>
    </section>
  );
}
