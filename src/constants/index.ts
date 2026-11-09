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
    title: "Space-Themed Fullstack Portfolio",
    slug: "space-themed-fullstack-portfolio",
    category: "Web",
    summary: "A futuristic space-themed developer portfolio with 3D celestial animations, dynamic holographic profile, and live stats.",
    description: "Engineered with Next.js 15, React 19, TypeScript, and Three.js celestial background. Features interactive 3D mouse parallax tilt, live GitHub and LeetCode analytics integration, responsive glassmorphism UI, and custom CRUD management dashboard.",
    imageUrl: "/images/portfolio-hero.png",
    liveUrl: "https://ehtesham-porfolio.vercel.app",
    repoUrl: "https://github.com/23f2001511/ehtesham-Porfolio",
    tags: ["Next.js 15", "TypeScript", "Three.js", "Tailwind CSS", "Framer Motion", "MongoDB"],
    featured: true,
    status: "Live",
    sortOrder: 1,
    architecture: [
      "Next.js 15 App Router",
      "Three.js Celestial Background",
      "Framer Motion 3D Physics",
      "API Analytics Route Integration"
    ]
  },
  {
    title: "Tesla Club NIT Patna Official Website",
    slug: "tesla-club-nit-patna-website",
    category: "Web",
    summary: "Official web platform built for Tesla Club NIT Patna featuring technical workshop showcases, events, and member profiles.",
    description: "Designed and developed for the Tesla Club at NIT Patna to showcase automotive innovations, technical projects, and campus initiatives. Features responsive layouts, modern interactive UI, and event management.",
    imageUrl: "",
    liveUrl: "https://tesla-website-black.vercel.app",
    repoUrl: "https://github.com/23f2001511/tesla_website",
    tags: ["TypeScript", "Next.js", "React", "Tailwind CSS", "NIT Patna"],
    featured: true,
    status: "Live",
    sortOrder: 2,
    architecture: [
      "Next.js React Frontend",
      "Tailwind CSS Design System",
      "Vercel Edge Deployment"
    ]
  },
  {
    title: "SensorSentry - Fleet Failure & RUL Predictor",
    slug: "sensorsentry-fleet-failure-predictor",
    category: "AI/ML",
    summary: "Industrial telemetry monitoring platform predicting machinery failures and Remaining Useful Life (RUL) before breakdowns occur.",
    description: "An AI-powered predictive maintenance platform that detects anomalies in industrial machinery telemetry. Implements machine learning models for Remaining Useful Life (RUL) forecasting, real-time risk level scoring, and anomaly alerts to prevent critical fleet downtime.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/SensorSentry",
    tags: ["Python", "Machine Learning", "Data Science", "Anomaly Detection", "Predictive Maintenance", "RUL"],
    featured: true,
    status: "Live",
    sortOrder: 3,
    architecture: [
      "Python ML Pipeline",
      "Sensor Telemetry Ingestion",
      "RUL Estimation Model",
      "Real-time Anomaly Classification"
    ]
  },
  {
    title: "Examination Portal Management System (IIT Madras)",
    slug: "examination-portal-management-iitm",
    category: "Web",
    summary: "Academic portal built for IIT Madras MAD-2 to conduct automated online examinations, timing control, and role-based student-faculty access.",
    description: "An end-to-end academic examination management platform developed for the IIT Madras BS Degree program (Modern Application Development 2). Built with role-based access control (RBAC), multi-tier user dashboards (Admin, Examiner, Student), question paper generation, real-time exam timing, and automated grade compilation.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/Examination_portal_management-IITM",
    tags: ["Python", "Flask", "SQLite", "Vue.js", "IIT Madras", "REST API", "RBAC"],
    featured: true,
    status: "Live",
    sortOrder: 4,
    architecture: [
      "Flask Backend REST API",
      "Vue.js Frontend Architecture",
      "SQLite / SQLAlchemy ORM",
      "Role-Based Access Control (RBAC)"
    ]
  },
  {
    title: "Hospital Management System (IIT Madras MAD-1)",
    slug: "hospital-management-system-iitm",
    category: "Web",
    summary: "Full-featured hospital operations system managing doctor-patient appointments, medical history logs, and administrative workflows.",
    description: "Academic milestone project for IIT Madras Modern Application Development 1. Features patient appointment booking, doctor availability schedules, medical history logs, prescription tracking, and centralized administrator controls with relational integrity.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/Hospital-management-system-sep2025-IITM-MAD-1",
    tags: ["Python", "Flask", "SQLite", "HTML5", "Bootstrap", "IIT Madras"],
    featured: false,
    status: "Live",
    sortOrder: 5,
    architecture: [
      "Flask MVC Architecture",
      "Relational Database Schema",
      "Jinja2 Templating Engine",
      "Session-Based Authentication"
    ]
  },
  {
    title: "Debug Diary - Tech Learning & Roadmap Platform",
    slug: "debug-diary-tech-roadmap",
    category: "Web",
    summary: "Developer guide portal providing structured IT roadmaps, curated guides, cheat sheets, and technical resources for aspiring programmers.",
    description: "A comprehensive developer portal and tech learning roadmap platform where students and aspiring developers can find structured guides, curated roadmaps, cheat sheets, and best practices across modern IT fields.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/Debug-Diary",
    tags: ["HTML5", "CSS3", "JavaScript", "Web Development", "Education"],
    featured: false,
    status: "Live",
    sortOrder: 6,
    architecture: [
      "Vanilla Web Tech Stack",
      "Responsive UI Design",
      "Structured Learning Catalog"
    ]
  },
  {
    title: "Sutradhaar - ET Hackathon Project",
    slug: "sutradhaar-et-hackathon",
    category: "Web",
    summary: "Collaborative solution engineered for the Economic Times (ET) Hackathon addressing workflow coordination and digital accessibility.",
    description: "A team hackathon solution built under rapid sprint conditions during the ET Hackathon. Focused on streamlined workflow management, digital accessibility, and automated coordination.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/sutradhaar",
    tags: ["Hackathon", "Full Stack", "Problem Solving", "Rapid Prototyping"],
    featured: false,
    status: "Live",
    sortOrder: 7,
    architecture: [
      "Hackathon Sprint Architecture",
      "Frontend Prototype",
      "Collaborative Workflow"
    ]
  },
  {
    title: "Tools in Data Science (TDS) - IIT Madras",
    slug: "tools-in-data-science-iitm",
    category: "AI/ML",
    summary: "Data science toolkit, ETL pipelines, automated scraping scripts, and statistical notebooks built for IIT Madras Diploma.",
    description: "A collection of data analytics scripts, ETL pipelines, automated scraping tools, and statistical analysis notebooks developed as part of the IIT Madras BS Degree Tools in Data Science diploma curriculum.",
    imageUrl: "",
    liveUrl: "",
    repoUrl: "https://github.com/23f2001511/TDS_iitm",
    tags: ["Python", "Data Science", "Pandas", "NumPy", "Web Scraping", "IIT Madras"],
    featured: false,
    status: "Live",
    sortOrder: 8,
    architecture: [
      "Data Processing Pipelines",
      "Automated Scripting Workflows",
      "Jupyter Data Science Notebooks"
    ]
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
