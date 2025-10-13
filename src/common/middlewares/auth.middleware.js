import jwt from "jsonwebtoken";
import { throwError } from "../utils/create-response.js";

export const authenticate = (secret) => {
  return (req, res, next) => {
    try {
      if (!secret) {
        return throwError(500, "NOT HAVE SECRECT KEY BACKEND DEV");
      }
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return throwError(400, "Token không tồn tại hoặc sai định dạng");
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return throwError(401, "Token đã hết hạn");
      }
      if (error.name === "JsonWebTokenError") {
        return throwError(401, "Token xác thực không hợp lệ");
      }
      return throwError(500, "Lỗi không xác định");
    }
  };
};
