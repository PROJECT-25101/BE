import { JWT_EXPIRED, JWT_SECRET } from "../../common/configs/environment.js";
import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { MAIL_MESSAGES } from "../mail/mail.messages.js";
import { getVerifyTemplateMail } from "../mail/mail.template.js";
import { sendMail } from "../mail/sendMail.js";
import User from "../user/user.model.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import { comparePassword, generateToken, hashPassword } from "./auth.utils.js";

export const registerService = async (payload) => {
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
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });
  return user;
};

export const loginService = async (payload) => {
  const { email, password } = payload;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throwError(400, AUTH_MESSAGES.NOTFOUND_EMAIL);
  }
  console.log(foundUser);
  const checkPassword = await comparePassword(password, foundUser.password);
  if (!checkPassword) {
    throwError(400, AUTH_MESSAGES.WRONG_PASSWORD);
  }
  const payloadToken = {
    _id: foundUser._id,
    role: foundUser.role,
  };
  const accessToken = generateToken(payloadToken, JWT_SECRET, JWT_EXPIRED);

  return { user: foundUser, accessToken };
};
