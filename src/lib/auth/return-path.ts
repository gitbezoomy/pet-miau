export function safeReturnPath(value: unknown, fallback = "/community") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) {
    return fallback;
  }

  return value;
}
