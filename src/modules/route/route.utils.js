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
