export const regexLower = (value) => {
  if (typeof value !== "string") return new RegExp(/^$/);
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped}$`, "i");
};
