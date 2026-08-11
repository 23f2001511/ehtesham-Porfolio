"use client";

import { useMemo } from "react";
import { siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AppEmptyState, AppLink, AppSection, AppSurface, StatTile } from "./appShared";
import { SocialIcon } from "../SocialIcon";
import { usePortfolioData } from "../PortfolioDataContext";

export default function AboutApp() {
  const { profile, resolved } = usePublicProfile();
  const { projects, skills } = usePortfolioData();

  const initials = useMemo(
    () =>
      (profile.name || siteConfig.name)
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [profile.name]
  );

  const experience = profile.experience ?? [];
  const education = profile.education ?? [];
  const bio = profile.aboutBio || "";
  const tagline = profile.tagline || "";
  const location = profile.location || siteConfig.location;
  const email = profile.email || "";
  const resumeUrl = profile.resumeUrl || "";

  return (
    <AppSurface>
      <div className="os-profile-hero">
        <div className="os-profile-hero__avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="os-profile-hero__name">{siteConfig.name}</p>
          {tagline ? <p className="os-profile-hero__tagline">{tagline}</p> : null}
          <div className="os-profile-hero__meta">
            {location ? <span>{location}</span> : null}
            {email ? (
              <a className="os-interactive os-profile-hero__mail" href={`mailto:${email}`}>
                {email}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="os-stat-grid" role="list" aria-label="Portfolio overview">
        <StatTile value={String(skills.length)} label="Skills tracked" />
        <StatTile value={String(projects.length)} label="Projects listed" />
        <StatTile value={String(experience.length)} label="Roles recorded" />
        <StatTile value={String(education.length)} label="Education entries" />
      </div>

      <AppSection title="About">
        {bio ? (
          <p className="os-body">{bio}</p>
        ) : (
          <AppEmptyState
            title="No bio yet"
            description={
              resolved
                ? "Add a short bio in the admin profile settings to tell visitors who you are."
                : "Loading profile…"
            }
          />
        )}
      </AppSection>

      <AppSection title="System profile">
        <dl className="os-facts">
          <div>
            <dt>Shell theme</dt>
            <dd>Developer OS · dark</dd>
          </div>
          <div>
            <dt>Command palette</dt>
            <dd>Ctrl / ⌘ + K</dd>
          </div>
          {location ? (
            <div>
              <dt>Location</dt>
              <dd>{location}</dd>
            </div>
          ) : null}
        </dl>
      </AppSection>

      {profile.socials.length > 0 && (
        <AppSection title="Profiles">
          <div className="os-chip-row">
            {profile.socials.map((link) => (
              <SocialIcon key={`${link.label}-${link.href}`} link={link} variant="row" />
            ))}
          </div>
        </AppSection>
      )}

      <AppSection>
        {resumeUrl ? (
          <AppLink href={resumeUrl} variant="primary">
            View resume
          </AppLink>
        ) : (
          resolved && (
            <AppEmptyState
              title="Resume not uploaded"
              description="Upload a resume PDF from the admin panel to enable one-click access here."
            />
          )
        )}
      </AppSection>
    </AppSurface>
  );
}
