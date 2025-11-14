import dayjs from "dayjs";
import { throwError } from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { ROUTE_MESSAGES } from "../route/route.messages.js";
import Route from "../route/route.model.js";
import { TRIP_MESSAGES } from "./trip.messages.js";
import Trip from "./trip.model.js";
import { checkCarAvailability, generateTrip } from "./trip.utils.js";

export const createTripService = async (payload) => {
  let { carId, routeId, startTime, arrivalTime } = payload;
  if (!arrivalTime) {
    const foundRoute = await Route.findById(routeId);
    if (!foundRoute) throwError(400, ROUTE_MESSAGES.NOT_FOUND_ROUTE);
    arrivalTime = dayjs(startTime).add(foundRoute.duration, "hour").toDate();
  }
  const existTrip = await checkCarAvailability(carId, startTime, arrivalTime);
  if (existTrip) {
    throwError(400, TRIP_MESSAGES.DUPLICATE_TRIP);
  }
  const newTrip = await Trip.create({ ...payload });
  return newTrip;
};

export const createManyTripService = async (payload) => {
  const trips = await generateTrip(payload);
  const tripCreated = await Trip.insertMany(trips);
  return tripCreated;
};

export const getAllTripService = async (query) => {
  const {
    "pickupPoint._id": pickupId,
    "dropPoint._id": dropId,
    ...otherQuery
  } = query;
  let routeId = null;
  if (pickupId && dropId) {
    const route = await Route.findOne({
      "pickupPoint._id": pickupId,
      "dropPoint._id": dropId,
    });

    if (!route) throwError(400, ROUTE_MESSAGES.NOT_FOUND_ROUTE);
    routeId = route._id;
  }
  const trips = await queryBuilder(
    Trip,
    { ...(routeId && { routeId }), ...otherQuery },
    {
      populate: [
        {
          path: "routeId",
          select: "pickupPoint dropPoint name duration",
        },
        {
          path: "carId",
          select: "name plateNumber type",
        },
      ],
    },
  );

  return trips;
};

export const getDetailTripService = async (id) => {
  const trip = await Trip.findById(id)
    .populate({
      path: "carId",
      select: "-createdAt -updatedAt",
    })
    .populate({ path: "routeId", select: "-createdAt -updatedAt" });
  return trip;
};
