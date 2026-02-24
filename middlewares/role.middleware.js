const { StatusCodes } = require("http-status-codes");

// Middleware to verify user role
const verifyRole = (...roles) => {
  return (req, res, next) => {
    // Check if user is attached by authenticateToken
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized. User not authenticated.",
      });
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "Access denied. You do not have permission for this action.",
      });
    }

    // Proceed
    next();
  };
};

module.exports = {
  verifyRole,
};