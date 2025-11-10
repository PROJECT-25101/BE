import { regexLower } from "../../common/utils/regex.js";
import Route from "./route.model.js";

export const checkDuplicateRoute = async (
  pickupPoint,
  dropPoint,
  description,
  excludeId = null,
) => {
  const condition = {
    "pickupPoint.label": regexLower(pickupPoint.label),
    "dropPoint.label": regexLower(dropPoint.label),
    description: regexLower(description),
  };
  if (excludeId) condition._id = { $ne: excludeId };
  return Route.findOne(condition);
};

export function checkDistrictDuplicate(districts) {
  const labelSet = new Set();
  const descSet = new Set();

  for (const d of districts) {
    const labelLower = regexLower(d.label);
    if (labelSet.has(labelLower)) {
      return true;
    }
    labelSet.add(labelLower);
    (d.description || []).forEach((desc) => {
      const descLower = regexLower(desc);
      if (descSet.has(descLower)) {
        return true;
      }
      descSet.add(descLower);
    });
  }

  return false;
}
