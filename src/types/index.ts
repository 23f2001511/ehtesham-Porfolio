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
