import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import { throwError } from "../../common/utils/create-response.js";
import { ROUTE_MESSAGES } from "../route/route.messages.js";
import Route from "../route/route.model.js";
import Trip from "../trip/trip.model.js";
import { TRIP_MESSAGES } from "./trip.messages.js";

dayjs.extend(isSameOrBefore);

export const checkCarAvailability = async (carId, startTime, arrivalTime) => {
  const overlappingTrip = await Trip.findOne({
    carId,
    $or: [
      { startTime: { $lt: arrivalTime, $gte: startTime } },
      { arrivalTime: { $gt: startTime, $lte: arrivalTime } },
      { startTime: { $lte: startTime }, arrivalTime: { $gte: arrivalTime } },
    ],
  });

  return !!overlappingTrip;
};

export const generateTrip = async (payload) => {
  const {
    routeId,
    carId,
    crew,
    startDate,
    endDate,
    departureTime,
    price,
    weekdays,
  } = payload;

  const route = await Route.findById(routeId);
  if (!route) throwError(400, ROUTE_MESSAGES.NOT_FOUND_ROUTE);

  const trips = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isSameOrBefore(end, "day")) {
    if (!weekdays || weekdays.includes(current.day())) {
      const departure = dayjs(
        `${current.format("YYYY-MM-DD")}T${departureTime}`,
      );
      const arrival = departure.add(route.duration, "hour");

      const isBusy = await checkCarAvailability(
        carId,
        departure.toDate(),
        arrival.toDate(),
      );
      if (isBusy) {
        throwError(400, TRIP_MESSAGES.DUPLICATE_TRIP);
      }

      trips.push({
        routeId,
        carId,
        crew,
        startTime: departure.toDate(),
        arrivalTime: arrival.toDate(),
        price,
        status: true,
        weekdays,
      });
    }

    current = current.add(1, "day");
  }

  return trips;
};
