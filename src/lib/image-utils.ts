export function extractPublicIds(html: string): string[] {
  if (!html) {
    return [];
  }

  const ids = new Set<string>();
  const regex = /<img[^>]*data-public-id="([^"]+)"[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const id = match[1]?.trim();
    if (id) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}
