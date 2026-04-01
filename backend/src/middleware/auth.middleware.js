import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authorization header is required.",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. No token provided.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decodedToken.id,
      _id: decodedToken.id,
      role: decodedToken.role,
    };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized. Token expired.",
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized. Invalid token.",
      });
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};
