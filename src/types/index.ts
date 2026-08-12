export type ProjectStatus = "Planning" | "In Progress" | "Live" | "Archived";

export type ProjectCategory = "Web" | "AI/ML" | "Software" | "Engineering" | "Other";

export type Project = {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  tags: string[];
  featured: boolean;
  status: ProjectStatus;
  sortOrder: number;
  // OS-portfolio additions (all optional — only rendered when populated)
  category?: ProjectCategory | string;
  problem?: string;
  solution?: string;
  features?: string[];
  challenges?: string;
  learnings?: string;
  architecture?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Skill = {
  id?: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
  years?: number;
  featured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Certificate = {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  summary: string;
  impact: string[];
};

export type EducationItem = {
  title: string;
  institution: string;
  period: string;
};
export type MessageStatus = "new" | "read" | "archived";

export type Message = {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type SocialLink = {
  label: string;
  href: string;
  icon: "Github" | "Linkedin" | "Mail" | "Twitter" | "Globe" | "Code";
};

export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  role: "admin";
  resumeUrl?: string;
  socials: SocialLink[];
  tagline?: string;
  aboutBio?: string;
  phone?: string;
  location?: string;
  githubUsername?: string;
  leetcodeUsername?: string;
  collegeEmail?: string;
  otherEmail?: string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  success: false;
  error: string;
  details?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;


/* ── Live analytics payloads (GitHub / LeetCode) ───────────────────────── */

export type GithubProfile = {
  login: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  location: string;
  blog: string;
  followers: number;
  following: number;
  publicRepos: number;
  createdAt: string;
  htmlUrl: string;
};

export type GithubRepo = {
  name: string;
  description: string;
  url: string;
  homepage: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string | null;
};

export type GithubLanguage = { name: string; count: number };

export type GithubContributionDay = {
  date: string;
  /** -1 when GitHub exposes only an intensity level, not an exact count */
  count: number;
  level: number;
};

export type GithubActivity = {
  type: string;
  repo: string;
  repoUrl: string;
  createdAt: string;
  commits: number | null;
};

export type GithubData = {
  profile: GithubProfile;
  totals: { stars: number; forks: number; contributionsLastYear: number | null };
  languages: GithubLanguage[];
  repos: GithubRepo[];
  activity: GithubActivity[];
  contributions: GithubContributionDay[] | null;
};

export type LeetcodeSolved = { all: number; easy: number; medium: number; hard: number };

export type LeetcodeLanguage = { name: string; solved: number };

export type LeetcodeBadge = { name: string; icon: string };

export type LeetcodeContest = {
  attended: number;
  rating: number;
  globalRanking: number | null;
  topPercentage: number | null;
};

export type LeetcodeRecent = { title: string; slug: string; timestamp: number };

export type LeetcodeData = {
  username: string;
  realName: string;
  avatar: string;
  ranking: number | null;
  reputation: number | null;
  solved: LeetcodeSolved;
  submissions: LeetcodeSolved;
  languages: LeetcodeLanguage[];
  badges: LeetcodeBadge[];
  /** unix-epoch-day -> submission count */
  calendar: Record<string, number>;
  contest: LeetcodeContest | null;
  recent: LeetcodeRecent[];
};
