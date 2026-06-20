export type ProjectStatus = "Planning" | "In Progress" | "Live" | "Archived";

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
  icon: "Github" | "Linkedin" | "Mail" | "Twitter" | "Globe";
};

export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  role: "admin";
  resumeUrl?: string;
  socials: SocialLink[];
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
