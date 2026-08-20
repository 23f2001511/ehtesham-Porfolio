"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import Reveal from "@/components/shared/Reveal";
import SectionHeading from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { fallbackCertificates } from "@/constants";
import { useCollection } from "@/hooks/useCollection";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/types";

export default function CertificatesSection() {
  const { data: certificates, isLoading, error } = useCollection<Certificate>(
    "/api/certificates",
    fallbackCertificates
  );

  return (
    <section id="certificates" className="section-pad">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certificates"
          title="Credentials that back the craft"
          description="Formal certifications and completed programs — the public record of structured learning."
          gradient
        />

        {error ? (
          <p className="mb-5 mt-8 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Live certificates could not be loaded. Showing curated starter content.
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : certificates.length ? (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert, index) => (
              <Reveal key={cert.id ?? `${cert.title}-${cert.issuer}`} delay={index * 0.05} className="h-full">
                <article className="panel card-lift group flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] bg-muted">
                    {cert.imageUrl ? (
                      <Image
                        src={cert.imageUrl}
                        alt={`${cert.title} certificate`}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_30%_30%,rgba(79,156,255,0.12),transparent_70%)]">
                        <Award className="h-10 w-10 text-primary/50" aria-hidden="true" />
                      </div>
                    )}
                    {cert.featured ? (
                      <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                        Featured
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {cert.title}
                        </h3>
                        <p className="mt-0.5 text-sm font-medium text-primary">{cert.issuer}</p>
                      </div>
                      {cert.credentialUrl ? (
                        <Link
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Verify ${cert.title} credential`}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-auto pt-4 text-xs text-muted-foreground">
                      Issued {formatDate(cert.issueDate)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              title="No certificates published yet"
              description="Add certificates from the admin dashboard to populate this section."
            />
          </div>
        )}
      </div>
    </section>
  );
}
