import type { Certificate, Project, Skill, SocialLink } from "@/types";

export const siteConfig = {
  name: "Ehtesham Aalam",
  role: "Full Stack Developer",
  email: "hello@ehtesham-aalam.dev",
  location: "India",
  resumeUrl: "/resume/ehtesham-aalam-resume.pdf",
  description:
    "I build polished, scalable web applications with Next.js, TypeScript, MongoDB, and thoughtful product design."
};

export const navItems = [
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Certificates", href: "/certificates" },
  { label: "Contact", href: "/contact" }
];

export const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Certificates", href: "/admin/certificates" },
  { label: "Resume", href: "/admin/resume" },
  { label: "Social Links", href: "/admin/social-links" }
];

export const heroStats = [
  { label: "Projects shipped", value: "12+" },
  { label: "Core stack", value: "MERN" },
  { label: "Focus", value: "UX + APIs" }
];

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/ehteshamaalam",
    icon: "Github"
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ehtesham-aalam",
    icon: "Linkedin"
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: "Mail"
  }
];

export const aboutHighlights = [
  "Building responsive, accessible interfaces with strong product instincts.",
  "Designing API routes and MongoDB schemas that stay maintainable as features grow.",
  "Learning continuously through IITM BS Data Science and hands-on full-stack projects."
];

export const experienceTimeline = [
  {
    role: "Full Stack Developer",
    company: "Independent Projects",
    period: "2024 - Present",
    summary:
      "Building production-style portfolio, dashboard, and data-backed web applications using the Next.js ecosystem.",
    impact: ["App Router architecture", "MongoDB data modeling", "Motion-rich interfaces"]
  },
  {
    role: "Data Science Student",
    company: "IIT Madras BS Degree",
    period: "2023 - Present",
    summary:
      "Strengthening fundamentals in programming, statistics, databases, and analytical thinking.",
    impact: ["Python and SQL foundations", "Data storytelling", "Problem decomposition"]
  }
];

export const fallbackProjects: Project[] = [
  {
    title: "Portfolio Admin System",
    slug: "portfolio-admin-system",
    summary: "A full-stack portfolio with CRUD dashboards, auth, uploads, and MongoDB persistence.",
    description:
      "Built with Next.js App Router, TypeScript, Mongoose, API routes, and a polished glassmorphism UI.",
    imageUrl: "/images/portfolio-hero.png",
    liveUrl: "",
    repoUrl: "",
    tags: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
    featured: true,
    status: "Live",
    sortOrder: 1
  },
  {
    title: "Project Intelligence Board",
    slug: "project-intelligence-board",
    summary: "A dashboard concept for tracking product work, blockers, milestones, and analytics.",
    description:
      "Designed around fast scanning, clean data hierarchy, reusable components, and admin workflows.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    tags: ["Dashboard", "UX", "APIs", "Analytics"],
    featured: true,
    status: "In Progress",
    sortOrder: 2
  },
  {
    title: "Developer Learning System",
    slug: "developer-learning-system",
    summary: "A learning tracker that turns courses, certificates, and practice into visible progress.",
    description:
      "Focused on progress modeling, state management, and a clean responsive experience for learners.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    tags: ["React", "Data", "Product Design"],
    featured: false,
    status: "Planning",
    sortOrder: 3
  }
];

export const fallbackSkills: Skill[] = [
  { name: "Next.js", category: "Frontend", level: 88, icon: "Layers", years: 2, featured: true, sortOrder: 1 },
  { name: "TypeScript", category: "Frontend", level: 84, icon: "Code2", years: 2, featured: true, sortOrder: 2 },
  { name: "React", category: "Frontend", level: 86, icon: "Atom", years: 2, featured: true, sortOrder: 3 },
  { name: "Tailwind CSS", category: "Design", level: 90, icon: "Palette", years: 2, featured: true, sortOrder: 4 },
  { name: "MongoDB", category: "Backend", level: 80, icon: "Database", years: 1, featured: true, sortOrder: 5 },
  { name: "Mongoose", category: "Backend", level: 78, icon: "Workflow", years: 1, featured: false, sortOrder: 6 },
  { name: "API Routes", category: "Backend", level: 82, icon: "Server", years: 2, featured: true, sortOrder: 7 },
  { name: "Framer Motion", category: "Design", level: 76, icon: "Sparkles", years: 1, featured: false, sortOrder: 8 },
  { name: "UI/UX", category: "Product", level: 83, icon: "MousePointer2", years: 2, featured: true, sortOrder: 9 }
];

export const fallbackCertificates: Certificate[] = [
  {
    title: "BS in Data Science and Applications",
    issuer: "IIT Madras",
    issueDate: "2026-01-01",
    credentialUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 1
  },
  {
    title: "Full Stack Web Development",
    issuer: "Project-Based Learning",
    issueDate: "2025-08-01",
    credentialUrl: "",
    imageUrl: "",
    featured: true,
    sortOrder: 2
  },
  {
    title: "Modern JavaScript and TypeScript",
    issuer: "Self-Paced Certification",
    issueDate: "2025-03-01",
    credentialUrl: "",
    imageUrl: "",
    featured: false,
    sortOrder: 3
  }
];
