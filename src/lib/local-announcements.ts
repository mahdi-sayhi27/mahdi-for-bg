import type { Announcement } from "@/types";

const LOCAL_ANNOUNCEMENTS_KEY = "maths-pour-bg:manual-announcements";
const LAST_SEEN_KEY = "maths-pour-bg:announcements-last-seen";
export const ANNOUNCEMENTS_READ_EVENT = "maths-pour-bg:announcements-read";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${base || "annonce"}-${Date.now().toString(36)}`;
}

function normalizeAnnouncements(announcements: Announcement[]) {
  return [...announcements].sort((left, right) => {
    if (left.pinned !== right.pinned) return left.pinned ? -1 : 1;
    const leftDate = new Date(left.publish_date).getTime();
    const rightDate = new Date(right.publish_date).getTime();
    return rightDate - leftDate;
  });
}

function isAnnouncement(value: unknown): value is Announcement {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<Announcement>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.category === "string" &&
    (candidate.cover_image === null || typeof candidate.cover_image === "string") &&
    Array.isArray(candidate.images) &&
    typeof candidate.author === "string" &&
    Array.isArray(candidate.tags) &&
    typeof candidate.featured === "boolean" &&
    typeof candidate.pinned === "boolean" &&
    typeof candidate.status === "string" &&
    typeof candidate.publish_date === "string" &&
    typeof candidate.created_at === "string"
  );
}

export function readManualAnnouncements() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return normalizeAnnouncements(parsed.filter(isAnnouncement));
  } catch {
    return [];
  }
}

export function writeManualAnnouncements(announcements: Announcement[]) {
  if (!canUseStorage()) return normalizeAnnouncements(announcements);

  const next = normalizeAnnouncements(announcements);

  try {
    window.localStorage.setItem(LOCAL_ANNOUNCEMENTS_KEY, JSON.stringify(next));
  } catch {
    return next;
  }

  return next;
}

export function updateManualAnnouncements(
  updater: (current: Announcement[]) => Announcement[],
) {
  const current = readManualAnnouncements();
  const next = updater(current);
  return writeManualAnnouncements(next);
}

export function createManualAnnouncement(
  announcement: Omit<Announcement, "id" | "created_at" | "slug"> &
    Partial<Pick<Announcement, "id" | "created_at" | "slug">>,
) {
  return {
    ...announcement,
    id: announcement.id ?? generateId(),
    slug: announcement.slug ?? generateSlug(announcement.title),
    created_at: announcement.created_at ?? new Date().toISOString(),
  } satisfies Announcement;
}

// --- Unread tracking (bell badge on the navbar) ---
export function getLastSeenAnnouncements() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(LAST_SEEN_KEY);
}

export function markAnnouncementsAsRead() {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
  window.dispatchEvent(new Event(ANNOUNCEMENTS_READ_EVENT));
}

export function countUnreadAnnouncements(announcements: Announcement[]) {
  const lastSeen = getLastSeenAnnouncements();
  const now = Date.now();

  const published = announcements.filter(
    (a) => a.status === "published" && new Date(a.publish_date).getTime() <= now,
  );

  if (!lastSeen) return published.length;

  const lastSeenTime = new Date(lastSeen).getTime();
  return published.filter((a) => new Date(a.publish_date).getTime() > lastSeenTime).length;
}
