import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { getAllUserService, getProfileService } from "./user.service.js";

export const getProfile = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await getProfileService(_id);
  return createResponse(res, 200, "OK", response);
});

export const getAllUser = handleAsync(async (req, res) => {
  const { query } = req;
  const { data, meta } = await getAllUserService(query);
  return createResponse(res, 200, "OK", data, meta);
});
