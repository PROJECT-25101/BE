export const normalizeQueryParams = (req, res, next) => {
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === "string") {
      if (value.toLowerCase() === "true") {
        req.query[key] = true;
      } else if (value.toLowerCase() === "false") {
        req.query[key] = false;
      }
    }
  }
  next();
};
