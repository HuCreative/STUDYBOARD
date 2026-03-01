import sanitizeHtml from 'sanitize-html';

export function sanitize(text: string): string {
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export function validateLength(text: string, min: number, max: number): boolean {
  const len = text.trim().length;
  return len >= min && len <= max;
}

// Simple rate limiter
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  
  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
    rateLimitMap.set(ip, record);
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}
