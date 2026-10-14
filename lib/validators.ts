const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clean(value: unknown, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

export function isEmail(value: string) {
  return emailPattern.test(value) && value.length <= 160;
}

export function requireFields(fields: Record<string, string>) {
  const missing = Object.entries(fields)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  return missing;
}
