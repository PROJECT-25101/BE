import Schedule from "./schedule.model.js";

export const checkConflictTime = async (
  carId,
  startT,
  endT,
  excludeId = null,
) => {
  const condition = {
    carId: carId,
    status: true,
    startTime: { $lte: endT },
    arrivalTime: { $gte: startT },
  };
  if (excludeId) condition._id = { $ne: excludeId };
  return await Schedule.findOne(condition);
};
