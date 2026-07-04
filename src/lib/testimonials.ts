const TITLE_PREFIX = "__title:";

export type TestimonialContent = {
  title: string;
  description: string;
};

export function decodeTestimonialComment(comment: string): TestimonialContent {
  if (!comment) {
    return { title: "", description: "" };
  }

  const lines = comment.split("\n");
  const firstLine = lines[0]?.trim() ?? "";

  if (firstLine.startsWith(TITLE_PREFIX)) {
    const title = firstLine.replace(TITLE_PREFIX, "").trim();
    const description = lines.slice(1).join("\n").trim();
    return { title, description };
  }

  return {
    title: "",
    description: comment.trim(),
  };
}

export function encodeTestimonialComment(title: string, description: string): string {
  const safeTitle = title.trim();
  const safeDescription = description.trim();
  return `${TITLE_PREFIX}${safeTitle}\n${safeDescription}`.trim();
}
