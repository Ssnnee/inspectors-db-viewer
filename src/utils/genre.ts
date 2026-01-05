export function normalizeGender(value: string) {
  const v = value.toLowerCase();
  if (["m", "h", "male", "homme"].includes(v)) return "male";
  if (["f", "female", "femme"].includes(v)) return "female";
  return "unknown";
}
