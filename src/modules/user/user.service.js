import {
  API_URL,
  JWT_VERIFY_EXPIRED,
  JWT_VERIFY_SECRET,
} from "../../common/configs/environment.js";
import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { queryBuilder } from "../../common/utils/query-builder.js";
import { AUTH_MESSAGES } from "../auth/auth.messages.js";
import { generateToken, hashPassword } from "../auth/auth.utils.js";
import { MAIL_MESSAGES } from "../mail/mail.messages.js";
import { getVerifyTemplateMail } from "../mail/mail.template.js";
import { sendMail } from "../mail/sendMail.js";
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

export const updateUserService = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throwError(400, "Không tìm thấy người dùng!");
  Object.assign(user, payload);
  await user.save();
};

export const createUserService = async (payload) => {
  const { userName, email, phone, password } = payload;
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }, { phone }],
  });

  if (existingUser) {
    const {
      userName: existingUserName,
      email: existingEmail,
      phone: existingPhone,
    } = existingUser;
    throwIfDuplicate(userName, existingUserName, AUTH_MESSAGES.CONFLICT_NAME);
    throwIfDuplicate(email, existingEmail, AUTH_MESSAGES.CONFLICT_EMAIL);
    throwIfDuplicate(phone, existingPhone, AUTH_MESSAGES.CONFLICT_EMAIL);
  }
  const hashedPassword = await hashPassword("goticket@123");
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });
  const payloadJwt = {
    _id: user._id,
    role: user.role,
  };
  const verifyToken = generateToken(
    payloadJwt,
    JWT_VERIFY_SECRET,
    JWT_VERIFY_EXPIRED,
  );
  user.verifyToken = verifyToken;
  await user.save();
  await sendMail(
    email,
    MAIL_MESSAGES.VERIFY_SEND,
    getVerifyTemplateMail({
      email,
      link: `${API_URL}/auth/verify/${verifyToken}`,
    }),
  );
  return user;
};
