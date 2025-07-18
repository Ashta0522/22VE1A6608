type Click = { timestamp: string; referrer?: string; ip?: string };
type UrlEntry = {
  url: string;
  created: string;
  expiry: string;
  shortcode: string;
  clicks: Click[];
};

const urls: Record<string, UrlEntry> = {};

function generateShortcode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function createShortUrl(
  url: string,
  validity: number,
  shortcode?: string
): UrlEntry | null {
  let code = shortcode || generateShortcode();
  if (urls[code]) return null;
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  urls[code] = {
    url,
    created: now.toISOString(),
    expiry: expiry.toISOString(),
    shortcode: code,
    clicks: [],
  };
  return urls[code];
}

export function getUrl(code: string): UrlEntry | null {
  return urls[code] || null;
}

export function addClick(code: string, referrer?: string, ip?: string) {
  if (urls[code]) {
    urls[code].clicks.push({
      timestamp: new Date().toISOString(),
      referrer,
      ip,
    });
  }
} 