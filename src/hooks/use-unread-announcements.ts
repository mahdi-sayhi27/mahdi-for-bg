"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchPublishedAnnouncements } from "@/lib/announcements";
import { countUnreadAnnouncements, ANNOUNCEMENTS_READ_EVENT } from "@/lib/local-announcements";

export function useUnreadAnnouncements() {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const { announcements } = await fetchPublishedAnnouncements();
    setCount(countUnreadAnnouncements(announcements));
  }, []);

  useEffect(() => {
    void refresh();

    const onRead = () => setCount(0);
    const onFocus = () => void refresh();

    window.addEventListener(ANNOUNCEMENTS_READ_EVENT, onRead);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onFocus);

    return () => {
      window.removeEventListener(ANNOUNCEMENTS_READ_EVENT, onRead);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onFocus);
    };
  }, [refresh]);

  return count;
}
