// Rate limiter for rejected uploads (modern photos)
// Only counts rejections, not successful restorations

const rejections = new Map<string, { count: number; firstRejection: number; blockedUntil: number }>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rejections) {
    if (now - data.firstRejection > 60 * 60 * 1000 && now > data.blockedUntil) {
      rejections.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Check if user is blocked from too many rejected uploads
export function isBlocked(identifier: string): { blocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const data = rejections.get(identifier);

  if (data && data.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((data.blockedUntil - now) / 1000);
    return { blocked: true, retryAfterSeconds };
  }

  return { blocked: false };
}

// Record a rejection (modern photo detected)
export function recordRejection(identifier: string): { shouldBlock: boolean } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour window
  const maxRejections = 50; // max 50 rejections per hour
  const blockDurationMs = 30 * 60 * 1000; // block for 30 minutes

  const data = rejections.get(identifier);

  if (!data || now - data.firstRejection > windowMs) {
    rejections.set(identifier, { count: 1, firstRejection: now, blockedUntil: 0 });
    return { shouldBlock: false };
  }

  data.count++;

  if (data.count > maxRejections) {
    data.blockedUntil = now + blockDurationMs;
    return { shouldBlock: true };
  }

  return { shouldBlock: false };
}
