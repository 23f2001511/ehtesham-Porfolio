import type { Certificate, EducationItem, ExperienceItem, Project, Skill, SocialLink } from "@/types";

export const siteConfig = {
  name: "Ehtesham Aalam",
  role: "Full Stack Developer",
  email: "alamehtesham88@gmail.com",
  collegeEmail: "ehteshama.ug24.ee@nitp.ac.in",
  otherEmail: "23f2001511@ds.study.iitm.ac.in",
  location: "India",
  resumeUrl: "/resume/ehtesham-aalam-resume.pdf",
  description:
    "I build polished, scalable web applications with Next.js, TypeScript, MongoDB, and thoughtful product design.",
  tagline: "Full-stack developer building data-driven products and polished web experiences.",
  githubUsername: "23f2001511",
  leetcodeUsername: "Ehteshsam_alam",
  linkedinUrl: "https://www.linkedin.com/in/ehtesham-aalam"
};

export const navItems = [
  { label: "Home", href: "/#home", id: "home" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "GitHub", href: "/#github", id: "github" },
  { label: "LeetCode", href: "/#leetcode", id: "leetcode" },
  { label: "Experience", href: "/#experience", id: "experience" },
  { label: "Education", href: "/#education", id: "education" },
  { label: "Certificates", href: "/#certificates", id: "certificates" },
  { label: "Resume", href: "/#resume", id: "resume" },
  { label: "Contact", href: "/#contact", id: "contact" }
];

export const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Profile", href: "/admin/profile" },
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
    href: "https://github.com/23f2001511",
    icon: "Github"
  },
  {
    label: "LinkedIn",
    href: siteConfig.linkedinUrl,
    icon: "Linkedin"
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/Ehteshsam_alam/",
    icon: "Code"
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

export const experienceTimeline: ExperienceItem[] = [
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

export const educationTimeline: EducationItem[] = [
  {
    title: "BS in Data Science and Applications",
    institution: "IIT Madras",
    period: "2023 - Present"
  }
];

export const fallbackProjects: Project[] = [
  {
    title: "Hospital Management System",
    slug: "hospital-management-system",
    category: "Web",
    summary: "A comprehensive hospital management platform with patient records, appointment scheduling, and staff management.",
    description:
      "Built with Flask, PostgreSQL, and SQLAlchemy for robust data handling and relational integrity across hospital workflows.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    tags: ["Flask", "PostgreSQL", "SQLAlchemy", "Python"],
    featured: true,
    status: "Live",
    sortOrder: 1
  },
  {
    title: "Plastic-to-Fuel Pyrolysis System",
    slug: "plastic-to-fuel-pyrolysis",
    category: "Engineering",
    summary: "A core engineering project converting plastic waste into usable fuel through thermal decomposition.",
    description:
      "Designed and prototyped a pyrolysis reactor system with temperature control, safety mechanisms, and fuel output analysis.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    tags: ["Engineering", "Thermodynamics", "Sustainability", "Design"],
    featured: true,
    status: "Live",
    sortOrder: 2
  },
  {
    title: "Clap-Activated Switch",
    slug: "clap-activated-switch",
    category: "Engineering",
    summary: "An analog electronics project that detects sound patterns to toggle electrical switches.",
    description:
      "Built with op-amps, filters, and flip-flop circuits for reliable clap-pattern detection and debouncing.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
    tags: ["Analog Electronics", "Circuit Design", "Op-Amps"],
    featured: true,
    status: "Live",
    sortOrder: 3
  },
  {
    title: "Portfolio Admin System",
    slug: "portfolio-admin-system",
    category: "Web",
    summary: "A full-stack portfolio with CRUD dashboards, auth, uploads, and MongoDB persistence.",
    description:
      "Built with Next.js App Router, TypeScript, Mongoose, API routes, and a polished glassmorphism UI.",
    architecture: ["Next.js frontend", "API routes", "Auth layer (HMAC sessions)", "Mongoose models", "MongoDB / JSON store", "File storage (public/uploads)"],
    imageUrl: "/images/portfolio-hero.png",
    liveUrl: "",
    repoUrl: "",
    tags: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
    featured: true,
    status: "Live",
    sortOrder: 4
  }
];

export const fallbackSkills: Skill[] = [
  // Data Science & Software
  { name: "Python", category: "Data Science & Software", level: 85, icon: "Code2", years: 2, featured: true, sortOrder: 1 },
  { name: "Java", category: "Data Science & Software", level: 75, icon: "Code2", years: 1, featured: true, sortOrder: 2 },
  { name: "JavaScript", category: "Data Science & Software", level: 88, icon: "Code2", years: 2, featured: true, sortOrder: 3 },
  { name: "SQL", category: "Data Science & Software", level: 82, icon: "Database", years: 2, featured: true, sortOrder: 4 },
  // Web Development
  { name: "React", category: "Web Development", level: 86, icon: "Atom", years: 2, featured: true, sortOrder: 5 },
  { name: "Next.js", category: "Web Development", level: 88, icon: "Layers", years: 2, featured: true, sortOrder: 6 },
  { name: "Flask", category: "Web Development", level: 78, icon: "Server", years: 1, featured: true, sortOrder: 7 },
  { name: "Supabase", category: "Web Development", level: 72, icon: "Database", years: 1, featured: false, sortOrder: 8 },
  { name: "Tailwind CSS", category: "Web Development", level: 90, icon: "Palette", years: 2, featured: true, sortOrder: 9 },
  { name: "TypeScript", category: "Web Development", level: 84, icon: "Code2", years: 2, featured: true, sortOrder: 10 },
  // Core Engineering
  { name: "MATLAB", category: "Core Engineering", level: 76, icon: "Workflow", years: 1, featured: true, sortOrder: 11 },
  { name: "Control Systems", category: "Core Engineering", level: 74, icon: "Workflow", years: 1, featured: true, sortOrder: 12 },
  { name: "Power Electronics", category: "Core Engineering", level: 70, icon: "Sparkles", years: 1, featured: false, sortOrder: 13 },
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
