import { throwError } from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { AUTH_MESSAGES } from "../auth/auth.messages.js";
import User from "./user.model.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError(401, AUTH_MESSAGES.NOTFOUND_USER);
  }
  return user;
};

export const getAllUserService = async (query) => {
  const users = await queryBuilder(User, query);
  return users;
};
