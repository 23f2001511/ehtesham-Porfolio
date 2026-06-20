import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  fallbackCertificates,
  fallbackProjects,
  fallbackSkills,
  siteConfig,
  socialLinks
} from "@/constants";
import type { Certificate, Message, Project, Skill, UserProfile } from "@/types";
import { slugify } from "@/utils/slugify";

type StoredProfile = UserProfile & {
  id: string;
};

type LocalStore = {
  profile: StoredProfile;
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  messages: Message[];
};

const storePath = path.join(process.cwd(), "data", "portfolio-store.json");

function now() {
  return new Date().toISOString();
}

function withMeta<T extends { id?: string; createdAt?: string; updatedAt?: string }>(item: T, index: number): T {
  const timestamp = now();

  return {
    ...item,
    id: item.id || randomUUID(),
    createdAt: item.createdAt || timestamp,
    updatedAt: item.updatedAt || timestamp,
    sortOrder: "sortOrder" in item ? item.sortOrder : index + 1
  } as T;
}

function createInitialStore(): LocalStore {
  return {
    profile: {
      id: "local-admin",
      name: siteConfig.name,
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      role: "admin",
      resumeUrl: siteConfig.resumeUrl,
      socials: socialLinks
    },
    projects: fallbackProjects.map(withMeta),
    skills: fallbackSkills.map(withMeta),
    certificates: fallbackCertificates.map(withMeta),
    messages: []
  };
}

async function readStore(): Promise<LocalStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalStore>;
    const initialStore = createInitialStore();

    return {
      profile: {
        ...initialStore.profile,
        ...parsed.profile
      },
      projects: parsed.projects || initialStore.projects,
      skills: parsed.skills || initialStore.skills,
      certificates: parsed.certificates || initialStore.certificates,
      messages: parsed.messages || initialStore.messages
    };
  } catch {
    const initialStore = createInitialStore();
    await writeStore(initialStore);
    return initialStore;
  }
}

async function writeStore(store: LocalStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function sortProjects(projects: Project[]) {
  return [...projects].sort((left, right) => {
    if (Number(right.featured) !== Number(left.featured)) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return String(right.createdAt || "").localeCompare(String(left.createdAt || ""));
  });
}

function sortSkills(skills: Skill[]) {
  return [...skills].sort((left, right) => {
    const categorySort = left.category.localeCompare(right.category);

    if (categorySort !== 0) {
      return categorySort;
    }

    if (Number(right.featured) !== Number(left.featured)) {
      return Number(right.featured) - Number(left.featured);
    }

    return left.sortOrder - right.sortOrder;
  });
}

function sortCertificates(certificates: Certificate[]) {
  return [...certificates].sort((left, right) => {
    if (Number(right.featured) !== Number(left.featured)) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return String(right.createdAt || "").localeCompare(String(left.createdAt || ""));
  });
}

function sortMessages(messages: Message[]) {
  return [...messages].sort((left, right) =>
    String(right.createdAt || "").localeCompare(String(left.createdAt || ""))
  );
}

function normalizeProject(input: Project) {
  return {
    ...input,
    slug: slugify(input.slug || input.title)
  };
}

function assertUniqueProjectSlug(projects: Project[], slug: string, currentId?: string) {
  const duplicate = projects.find((project) => project.slug === slug && project.id !== currentId);

  if (duplicate) {
    throw new Error("A project with this slug already exists.");
  }
}

export const localStore = {
  async getProfile() {
    const store = await readStore();
    return store.profile;
  },

  async updateProfile(updates: Partial<Pick<UserProfile, "resumeUrl" | "socials">>) {
    const store = await readStore();
    store.profile = {
      ...store.profile,
      ...updates
    };
    await writeStore(store);
    return store.profile;
  },

  async listProjects() {
    const store = await readStore();
    return sortProjects(store.projects);
  },

  async createProject(input: Project) {
    const store = await readStore();
    const project = withMeta(normalizeProject(input), store.projects.length);
    assertUniqueProjectSlug(store.projects, project.slug);
    store.projects.push(project);
    await writeStore(store);
    return project;
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const store = await readStore();
    const index = store.projects.findIndex((project) => project.id === id);

    if (index === -1) {
      return null;
    }

    const current = store.projects[index];
    const next = normalizeProject({
      ...current,
      ...updates,
      slug: updates.slug || current.slug,
      title: updates.title || current.title,
      updatedAt: now()
    });

    assertUniqueProjectSlug(store.projects, next.slug, id);
    store.projects[index] = next;
    await writeStore(store);
    return next;
  },

  async deleteProject(id: string) {
    const store = await readStore();
    const project = store.projects.find((item) => item.id === id);

    if (!project) {
      return null;
    }

    store.projects = store.projects.filter((item) => item.id !== id);
    await writeStore(store);
    return project;
  },

  async listSkills() {
    const store = await readStore();
    return sortSkills(store.skills);
  },

  async createSkill(input: Skill) {
    const store = await readStore();
    const skill = withMeta(input, store.skills.length);
    store.skills.push(skill);
    await writeStore(store);
    return skill;
  },

  async updateSkill(id: string, updates: Partial<Skill>) {
    const store = await readStore();
    const index = store.skills.findIndex((skill) => skill.id === id);

    if (index === -1) {
      return null;
    }

    const skill = {
      ...store.skills[index],
      ...updates,
      updatedAt: now()
    };
    store.skills[index] = skill;
    await writeStore(store);
    return skill;
  },

  async deleteSkill(id: string) {
    const store = await readStore();
    const skill = store.skills.find((item) => item.id === id);

    if (!skill) {
      return null;
    }

    store.skills = store.skills.filter((item) => item.id !== id);
    await writeStore(store);
    return skill;
  },

  async listCertificates() {
    const store = await readStore();
    return sortCertificates(store.certificates);
  },

  async createCertificate(input: Certificate) {
    const store = await readStore();
    const certificate = withMeta(input, store.certificates.length);
    store.certificates.push(certificate);
    await writeStore(store);
    return certificate;
  },

  async updateCertificate(id: string, updates: Partial<Certificate>) {
    const store = await readStore();
    const index = store.certificates.findIndex((certificate) => certificate.id === id);

    if (index === -1) {
      return null;
    }

    const certificate = {
      ...store.certificates[index],
      ...updates,
      updatedAt: now()
    };
    store.certificates[index] = certificate;
    await writeStore(store);
    return certificate;
  },

  async deleteCertificate(id: string) {
    const store = await readStore();
    const certificate = store.certificates.find((item) => item.id === id);

    if (!certificate) {
      return null;
    }

    store.certificates = store.certificates.filter((item) => item.id !== id);
    await writeStore(store);
    return certificate;
  },

  async listMessages() {
    const store = await readStore();
    return sortMessages(store.messages);
  },

  async createMessage(input: Omit<Message, "id" | "status" | "createdAt" | "updatedAt">) {
    const store = await readStore();
    const timestamp = now();
    const message: Message = {
      ...input,
      id: randomUUID(),
      status: "new",
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.messages.push(message);
    await writeStore(store);
    return message;
  },

  async updateMessageStatus(id: string, status: Message["status"]) {
    const store = await readStore();
    const index = store.messages.findIndex((message) => message.id === id);

    if (index === -1) {
      return null;
    }

    const message = {
      ...store.messages[index],
      status,
      updatedAt: now()
    };
    store.messages[index] = message;
    await writeStore(store);
    return message;
  },

  async deleteMessage(id: string) {
    const store = await readStore();
    const message = store.messages.find((item) => item.id === id);

    if (!message) {
      return null;
    }

    store.messages = store.messages.filter((item) => item.id !== id);
    await writeStore(store);
    return message;
  }
};
