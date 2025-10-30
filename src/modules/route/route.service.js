import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { regexLower } from "../../common/utils/regex.js";
import { ROUTE_MESSAGES } from "./route.messages.js";
import Route from "./route.model.js";

export const getAllRouteService = async (query) => {
  const routes = await queryBuilder(Route, query);
  return routes;
};

export const getDetailRouteService = async (id) => {
  const route = await Route.findById(id);
  return route;
};

export const createRouteService = async (payload) => {
  const { name, pickupPoint, dropPoint } = payload;
  if (regexLower(pickupPoint.label) === regexLower(dropPoint.label)) {
    throwError(400, ROUTE_MESSAGES.DUPLICATE_PICK_DROP);
  }
  const existRoute = await Route.findOne({
    $or: [
      { name: regexLower(name) },
      {
        $and: [
          { "pickupPoint.label": regexLower(pickupPoint.label) },
          { "dropPoint.label": regexLower(dropPoint.label) },
        ],
      },
    ],
  });
  if (existRoute) {
    throwIfDuplicate(existRoute.name, name, ROUTE_MESSAGES.EXISTING_NAME);
    throwError(
      400,
      ROUTE_MESSAGES.EXISTING_ROUTE(pickupPoint.label, dropPoint.label),
    );
  }
  const route = await Route.create(payload);
  return route;
};

export const updateRouteService = async (id, payload) => {
  const { name, pickupPoint, dropPoint } = payload;
  if (regexLower(pickupPoint) === regexLower(dropPoint)) {
    throwError(400, ROUTE_MESSAGES.DUPLICATE_PICK_DROP);
  }
  const existRoute = await Route.findOne({
    _id: { $ne: id },
    $or: [
      { name: regexLower(name) },
      {
        $and: [
          { "pickupPoint.label": regexLower(pickupPoint.label) },
          { "dropPoint.label": regexLower(dropPoint.label) },
        ],
      },
    ],
  });
  if (existRoute) {
    throwIfDuplicate(existRoute.name, name, ROUTE_MESSAGES.EXISTING_NAME);
    throwError(
      400,
      ROUTE_MESSAGES.EXISTING_ROUTE(pickupPoint.label, dropPoint.label),
    );
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
