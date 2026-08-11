"use client";

import { GraduationCap } from "lucide-react";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AppEmptyState, AppSurface } from "./appShared";

export default function EducationApp() {
  const { profile, resolved } = usePublicProfile();
  const education = profile.education ?? [];

  return (
    <AppSurface>
      {!resolved ? (
        <div aria-hidden="true">
          <span className="os-skeleton-line os-skeleton-line--w60" />
          <span className="os-skeleton-line os-skeleton-line--w40" />
        </div>
      ) : education.length === 0 ? (
        <AppEmptyState
          title="No education configured"
          description="Add education entries from the admin profile panel."
        />
      ) : (
        <ul className="os-education">
          {education.map((item) => (
            <li key={`${item.title}-${item.institution}`} className="os-education__item">
              <span className="os-education__icon" aria-hidden="true">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="os-education__title">{item.title}</h3>
                <p className="os-education__institution">{item.institution}</p>
                <p className="os-education__period">{item.period}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppSurface>
  );
}
