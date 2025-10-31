import axios from "axios";
import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { ROUTE_MESSAGES } from "./route.messages.js";
import {
  createRouteService,
  getAllRouteService,
  getDetailRouteService,
  updateRouteService,
  updateStatusRouteService,
} from "./route.service.js";

export const getAllProvince = handleAsync(async (req, res) => {
  const { data } = await axios.get(
    `https://production.cas.so/address-kit/2025-07-01/provinces`,
  );
  const newResponse = data?.provinces?.map((item) => ({
    label: item.name,
    _id: item.code,
  }));
  return createResponse(res, 200, ROOT_MESSAGES.OK, newResponse);
});

export const getAllRoute = handleAsync(async (req, res) => {
  const query = req.query;
  const { data, meta } = await getAllRouteService(query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, data, meta);
});

export const getDetailRoute = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await getDetailRouteService(id);
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const createRoute = handleAsync(async (req, res) => {
  const payload = req.body;
  const response = await createRouteService(payload);
  return createResponse(res, 201, ROUTE_MESSAGES.CREATED_ROUTE, response);
});

export const updateRoute = handleAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const response = await updateRouteService(id, payload);
  return createResponse(res, 200, ROUTE_MESSAGES.UPDATED_ROUTE, response);
});

export const updateStatusRoute = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await updateStatusRouteService(id);
  return createResponse(
    res,
    200,
    response.status ? ROUTE_MESSAGES.ACTIVATED : ROUTE_MESSAGES.DEACTIVATED,
    response,
  );
});
