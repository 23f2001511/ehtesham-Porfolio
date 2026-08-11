"use client";

import { useEffect, useState } from "react";
import { siteConfig, socialLinks } from "@/constants";
import type { ApiResponse, UserProfile } from "@/types";

const fallbackProfile: UserProfile = {
  name: siteConfig.name,
  email: siteConfig.email,
  role: "admin",
  resumeUrl: siteConfig.resumeUrl,
  socials: socialLinks,
  tagline: "",
  aboutBio: "",
  phone: "",
  location: "",
  githubUsername: siteConfig.githubUsername,
  leetcodeUsername: siteConfig.leetcodeUsername,
  collegeEmail: siteConfig.collegeEmail,
  otherEmail: siteConfig.otherEmail,
  experience: [],
  education: []
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
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let active = true;

    fetchPublicProfile().then((nextProfile) => {
      if (active) {
        setProfile(nextProfile);
        setResolved(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { profile, resolved };
}
