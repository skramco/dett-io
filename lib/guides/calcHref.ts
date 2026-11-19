export function calcHref(
  slug: string,
  params: Record<string, string | number | boolean>
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.set(key, String(value));
  }
  return `/calculators/${slug}?${search.toString()}`;
}