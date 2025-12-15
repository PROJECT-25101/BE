import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createUserService,
  getAllUserService,
  getProfileService,
  updateUserService,
} from "./user.service.js";

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

export const updateUser = handleAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  const data = await updateUserService(id, payload);
  return createResponse(res, 200, "Cập nhật thành công!", data);
});

export const createUser = handleAsync(async (req, res) => {
  const payload = req.body;
  const data = await createUserService(payload);
  return createResponse(
    res,
    200,
    "Tạo mới người dùng thành công. Kiểm tra email để kích hoạt tài khoản!",
    data,
  );
});
