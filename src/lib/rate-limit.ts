// Simple in-memory rate limiter
// Limits per user ID or IP address

const requests = new Map<string, { count: number; firstRequest: number; blockedUntil: number }>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requests) {
    if (now - data.firstRequest > 30 * 60 * 1000 && now > data.blockedUntil) {
      requests.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minute window
  const maxRequests = 15; // max 15 requests per 5 minutes
  const blockDurationMs = 15 * 60 * 1000; // block for 15 minutes if exceeded

  const data = requests.get(identifier);

  // Currently blocked
  if (data && data.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((data.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // No previous requests or window expired
  if (!data || now - data.firstRequest > windowMs) {
    requests.set(identifier, { count: 1, firstRequest: now, blockedUntil: 0 });
    return { allowed: true };
  }

  // Within window
  data.count++;

  if (data.count > maxRequests) {
    // Block the user
    data.blockedUntil = now + blockDurationMs;
    return { allowed: false, retryAfterSeconds: Math.ceil(blockDurationMs / 1000) };
  }

  return { allowed: true };
}
