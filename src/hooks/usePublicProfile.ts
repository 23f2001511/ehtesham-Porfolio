"use client";

import { useEffect, useState } from "react";
import { siteConfig, socialLinks } from "@/constants";
import type { ApiResponse, UserProfile } from "@/types";

const fallbackProfile: UserProfile = {
  name: siteConfig.name,
  email: siteConfig.email,
  role: "admin",
  resumeUrl: siteConfig.resumeUrl,
  socials: socialLinks
};

let profileRequest: Promise<UserProfile> | null = null;

async function fetchPublicProfile() {
  if (!profileRequest) {
    profileRequest = fetch("/api/auth?scope=public-profile", {
      cache: "no-store"
    })
      .then(async (response) => {
        const payload = (await response.json()) as ApiResponse<UserProfile>;

        if (!payload.success) {
          throw new Error(payload.error);
        }

        return {
          ...fallbackProfile,
          ...payload.data,
          resumeUrl: payload.data.resumeUrl || fallbackProfile.resumeUrl,
          socials: payload.data.socials?.length ? payload.data.socials : fallbackProfile.socials
        };
      })
      .catch(() => fallbackProfile);
  }

  return profileRequest;
}

export function usePublicProfile() {
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const nextProfile = await fetchPublicProfile();

      if (active) {
        setProfile(nextProfile);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return profile;
}
