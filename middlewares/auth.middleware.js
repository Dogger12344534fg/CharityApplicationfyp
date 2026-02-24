const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user info to request object
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized. Token expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
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

module.exports = {
  authenticateToken,
};