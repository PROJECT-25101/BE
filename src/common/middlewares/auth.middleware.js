import jwt from "jsonwebtoken";
import { throwError } from "../utils/create-response";

export const authenticate = (secret) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throwError(400, "Token không tồn tại hoặc sai định dạng");
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throwError(401, "Token đã hết hạn");
      }
      if (error.name === "JsonWebTokenError") {
        throwError(401, "Token xác thực không hợp lệ");
      }
      throwError(500, "Lỗi không xác định");
    }
  };
};
