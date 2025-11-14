import mongoose from "mongoose";
import { regexLower } from "../../common/utils/regex.js";
import Route from "./route.model.js";

export const checkDuplicateRoute = async (
  pickupPoint,
  dropPoint,
  description,
  excludeId = null,
) => {
  const baseCondition = {
    "pickupPoint.label": regexLower(pickupPoint.label),
    "dropPoint.label": regexLower(dropPoint.label),
    description: regexLower(description),
  };
  if (excludeId) {
    baseCondition._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
  }
  const routes = await Route.find(baseCondition).lean();
  console.log(routes);
  if (!routes.length) return null;
  for (const route of routes) {
    const pickDistricts =
      pickupPoint.district?.map((d) => d.label.toLowerCase()) || [];
    const dropDistricts =
      dropPoint.district?.map((d) => d.label.toLowerCase()) || [];
    const pickDistrictExist = route.pickupPoint?.district?.some((d) =>
      pickDistricts.includes(d.label.toLowerCase()),
    );
    const dropDistrictExist = route.dropPoint?.district?.some((d) =>
      dropDistricts.includes(d.label.toLowerCase()),
    );
    if (pickDistrictExist && dropDistrictExist) {
      return route;
    }
  }
  return null;
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
