import { updateErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return next(updateErrorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(updateErrorHandler(403, "Unauthorized"));
    }

    req.user = user;
    next();
  });
};
