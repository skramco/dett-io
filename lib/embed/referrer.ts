const HOSTNAME = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const LOCALHOST = /^(localhost|127\.0\.0\.1)$/i;

/**
 * Extract a registrable-looking hostname from a referrer URL or host string.
 * Returns null when the value is missing, malformed, or looks like a private path
 * rather than a domain. Never returns a full URL, query string, or user info.
 */
export function referringDomainFrom(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 500) return null;

  let hostname = '';
  try {
    if (trimmed.includes('://')) {
      hostname = new URL(trimmed).hostname;
    } else {
      hostname = trimmed.split('/')[0].split(':')[0];
    }
  } catch {
    return null;
  }

  hostname = hostname.replace(/\.$/, '').toLowerCase();
  if (!hostname || hostname.length > 253) return null;
  if (LOCALHOST.test(hostname)) return hostname;
  if (!HOSTNAME.test(hostname)) return null;
  return hostname;
}
