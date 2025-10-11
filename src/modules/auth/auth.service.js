import jwt from "jsonwebtoken";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  JWT_ACCESS_EXPIRED,
  JWT_ACCESS_SECRET,
  JWT_VERIFY_EXPIRED,
  JWT_VERIFY_SECRET,
} from "../../common/configs/environment.js";
import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import { MAIL_MESSAGES } from "../mail/mail.messages.js";
import { getVerifyTemplateMail } from "../mail/mail.template.js";
import { sendMail } from "../mail/sendMail.js";
import User from "../user/user.model.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import {
  comparePassword,
  generateToken,
  getResponseGoogle,
  hashPassword,
} from "./auth.utils.js";

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
      link: `http://localhost:8000/api/auth/verify/${verifyToken}`,
    }),
  );
  return user;
};

export const loginService = async (payload) => {
  const { email, password } = payload;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throwError(400, AUTH_MESSAGES.NOTFOUND_EMAIL);
  }
  const checkPassword = await comparePassword(password, foundUser.password);
  if (!checkPassword) {
    throwError(400, AUTH_MESSAGES.WRONG_PASSWORD);
  }
  if (!foundUser.isVerified) {
    throwError(400, AUTH_MESSAGES.NOT_VERIFIED);
  }
  const payloadToken = {
    _id: foundUser._id,
    role: foundUser.role,
  };
  const accessToken = generateToken(
    payloadToken,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRED,
  );

  return { user: foundUser, accessToken };
};

export const verifyUserService = async (token) => {
  try {
    const user = await User.findOne({ verifyToken: token });
    if (!user)
      return {
        success: false,
        data: "invalid",
        message: "Không tìm thấy người dùng",
      };
    if (user.isVerified)
      return {
        success: false,
        data: "inactive",
        message: "Tài khoản đã được kích hoạt",
      };
    jwt.verify(token, JWT_VERIFY_SECRET);
    user.isVerified = true;
    user.set("verifyToken", undefined);
    await user.save();
    return { success: true, data: "success" };
  } catch (error) {
    const messages = {
      TokenExpiredError: { data: "expired", message: "Token đã hết hạn" },
      JsonWebTokenError: { data: "invalid", message: "Token không hợp lệ" },
    };
    return {
      success: false,
      ...(messages[error.name] || {
        data: "error",
        message: "Xác thực thất bại",
      }),
    };
  }
};

export const loginGooleService = async () => {
  const scope = ["openid", "email", "profile"].join(" ");
  const oauth2Url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}` +
    `&access_type=offline` +
    `&prompt=consent`;
  return oauth2Url;
};

export const callbackLoginGoogleService = async (code) => {
  try {
    const {
      sub: googleId,
      email,
      name: userName,
      picture: avatar,
    } = await getResponseGoogle(code);

    let user = await User.findOne({ googleId });
    if (!user) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        existingUserByEmail.googleId = googleId;
        existingUserByEmail.provider.push("google");
        existingUserByEmail.isVerified = true;
        await existingUserByEmail.save();
        user = existingUserByEmail;
      }
      if (!existingUserByEmail) {
        user = new User({
          googleId,
          email,
          userName,
          avatar,
          provider: ["google"],
          isVerified: true,
        });
        await user.save();
      }
    }
    const payload = {
      _id: user._id,
      role: user.role,
    };
    const accessToken = generateToken(
      payload,
      JWT_ACCESS_SECRET,
      JWT_ACCESS_EXPIRED,
    );
    return { success: true, user: user.toObject(), accessToken };
  } catch (error) {
    return { success: false, data: "server" };
  }
};
