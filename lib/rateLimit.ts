const rateMap = new Map<string, { count: number; time: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (now - entry.time > windowMs) {
    rateMap.set(ip, { count: 1, time: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
