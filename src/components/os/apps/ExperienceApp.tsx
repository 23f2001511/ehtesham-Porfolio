"use client";

import { usePublicProfile } from "@/hooks/usePublicProfile";
import { AppEmptyState, AppSurface } from "./appShared";

export default function ExperienceApp() {
  const { profile, resolved } = usePublicProfile();
  const experience = profile.experience ?? [];

  return (
    <AppSurface>
      {!resolved ? (
        <div className="os-timeline" aria-hidden="true">
          {[0, 1].map((item) => (
            <div key={item} className="os-timeline__item os-timeline__item--skeleton">
              <span className="os-timeline__dot" />
              <div className="os-timeline__body">
                <span className="os-skeleton-line os-skeleton-line--w40" />
                <span className="os-skeleton-line os-skeleton-line--w70" />
                <span className="os-skeleton-line os-skeleton-line--w90" />
              </div>
            </div>
          ))}
        </div>
      ) : experience.length === 0 ? (
        <AppEmptyState
          title="No experience recorded"
          description="Add roles from the admin profile panel once they exist."
        />
      ) : (
        <ol className="os-timeline">
          {experience.map((item) => (
            <li key={`${item.role}-${item.company}`} className="os-timeline__item">
              <span className="os-timeline__dot" aria-hidden="true" />
              <div className="os-timeline__body">
                <p className="os-timeline__period">{item.period}</p>
                <h3 className="os-timeline__role">{item.role}</h3>
                <p className="os-timeline__company">{item.company}</p>
                {item.summary && <p className="os-body">{item.summary}</p>}
                {item.impact.length > 0 && (
                  <ul className="os-pill-list">
                    {item.impact.map((impact) => (
                      <li key={impact} className="os-pill">
                        {impact}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </AppSurface>
  );
}
