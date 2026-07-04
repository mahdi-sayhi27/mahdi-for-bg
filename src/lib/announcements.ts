import { createClientOrNull, hasValidSupabaseEnv } from "@/lib/supabase/client";
import { readManualAnnouncements } from "@/lib/local-announcements";
import { PLACEHOLDER_ANNOUNCEMENTS } from "@/constants";
import type { Announcement } from "@/types";

const ANNOUNCEMENT_COLUMNS =
  "id, slug, title, description, content, category, cover_image, images, author, tags, featured, pinned, status, publish_date, priority, created_at";

/** Public-facing announcements: published only, publish_date in the past. Falls back to local storage, then demo data. */
export async function fetchPublishedAnnouncements(): Promise<{
  announcements: Announcement[];
  supabaseUnavailable: boolean;
}> {
  if (!hasValidSupabaseEnv()) {
    const manual = readManualAnnouncements();
    const source = manual.length > 0 ? manual : PLACEHOLDER_ANNOUNCEMENTS;
    return { announcements: filterPublished(source), supabaseUnavailable: true };
  }

  const supabase = createClientOrNull();
  if (!supabase) {
    return { announcements: filterPublished(PLACEHOLDER_ANNOUNCEMENTS), supabaseUnavailable: true };
  }

  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .eq("status", "published")
    .order("publish_date", { ascending: false });

  if (error || !data) {
    const manual = readManualAnnouncements();
    const source = manual.length > 0 ? manual : PLACEHOLDER_ANNOUNCEMENTS;
    return { announcements: filterPublished(source), supabaseUnavailable: true };
  }

  return { announcements: filterPublished(data as Announcement[]), supabaseUnavailable: false };
}

/** Admin-facing: every announcement regardless of status. */
export async function fetchAllAnnouncements(): Promise<{
  announcements: Announcement[];
  supabaseUnavailable: boolean;
}> {
  if (!hasValidSupabaseEnv()) {
    return { announcements: readManualAnnouncements(), supabaseUnavailable: true };
  }

  const supabase = createClientOrNull();
  if (!supabase) {
    return { announcements: readManualAnnouncements(), supabaseUnavailable: true };
  }

  const { data, error } = await supabase
    .from("announcements")
    .select(ANNOUNCEMENT_COLUMNS)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { announcements: readManualAnnouncements(), supabaseUnavailable: true };
  }

  return { announcements: data as Announcement[], supabaseUnavailable: false };
}

function filterPublished(announcements: Announcement[]) {
  const now = Date.now();
  return announcements
    .filter((a) => a.status === "published" && new Date(a.publish_date).getTime() <= now)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime();
    });
}
