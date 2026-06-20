import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req,
  res,
  next
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {
    try {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(
        decoded.id
      ).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "No autorizado",
        });
      }

      if (!req.user.isEmailVerified) {
        return res.status(403).json({
          message: "Debes verificar tu email para acceder",
          code: "EMAIL_NOT_VERIFIED",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Token inválido",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No autorizado",
    });
  }
};