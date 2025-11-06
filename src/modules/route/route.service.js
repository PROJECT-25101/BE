import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { regexLower } from "../../common/utils/regex.js";
import { ROUTE_MESSAGES } from "./route.messages.js";
import Route from "./route.model.js";
import { checkDuplicateRoute } from "./route.utils.js";

export const getPointService = async (pickupPointId) => {
  const conditional = pickupPointId ? { "pickupPoint._id": pickupPointId } : {};
  const pointPick = pickupPointId ? "dropPoint" : "pickupPoint";
  const routes = await Route.find(conditional).lean();
  const pointUnique = new Map();
  routes.forEach((item) => {
    if (!pointUnique.has(item[pointPick]._id)) {
      pointUnique.set(item[pointPick]._id.toString(), {
        ...item[pointPick],
      });
    }
  });
  return [...pointUnique.values()];
};

export const getAllRouteService = async (query) => {
  const routes = await queryBuilder(Route, query);
  return routes;
};

export const getDetailRouteService = async (id) => {
  const route = await Route.findById(id);
  return route;
};

export const createRouteService = async (payload) => {
  const { pickupPoint, dropPoint, description } = payload;
  if (regexLower(pickupPoint.label) === regexLower(dropPoint.label)) {
    throwError(400, ROUTE_MESSAGES.DUPLICATE_PICK_DROP);
  }
  const existRoute = await checkDuplicateRoute(
    pickupPoint,
    dropPoint,
    description,
  );
  if (existRoute) {
    throwError(400, ROUTE_MESSAGES.EXISTING_ROUTE_VIACITIES);
  }
  const route = await Route.create(payload);
  return route;
};

export const updateRouteService = async (id, payload) => {
  const { description, pickupPoint, dropPoint } = payload;
  if (regexLower(pickupPoint.label) === regexLower(dropPoint.label)) {
    throwError(400, ROUTE_MESSAGES.DUPLICATE_PICK_DROP);
  }
  const existRoute = await checkDuplicateRoute(
    pickupPoint,
    dropPoint,
    description,
    id,
  );
  if (existRoute) {
    throwError(400, ROUTE_MESSAGES.EXISTING_ROUTE_VIACITIES);
  }
  const updated = await Route.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const updateStatusRouteService = async (id) => {
  const findRoute = await Route.findById(id);
  if (!findRoute) throwError(400, ROUTE_MESSAGES.NOT_FOUND_ROUTE);
  findRoute.status = !findRoute.status;
  await findRoute.save();
  return findRoute;
};
