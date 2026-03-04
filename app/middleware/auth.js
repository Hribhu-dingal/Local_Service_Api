const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");

// ================= USER AUTH =================
const userAuth = async (req, res, next) => {
  try {
    // Get token from cookies
    const token =
      req.cookies.userToken ||
      req.cookies.adminToken ||
      req.cookies.providerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // VERY IMPORTANT: use decoded.id (NOT _id)
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      res.clearCookie("userToken");
      res.clearCookie("adminToken");
      res.clearCookie("providerToken");

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    res.clearCookie("userToken");
    res.clearCookie("adminToken");
    res.clearCookie("providerToken");

    return res.status(401).json({
      success: false,
      message: "Session expired, please login again",
    });
  }
};

// ================= ROLE AUTH =================
const roleAuth = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Please login first",
        });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `Access denied: only ${role}s can access this`,
        });
      }

      next();
    } catch (error) {
      console.error("RoleAuth error:", error.message);

      return res.status(401).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

module.exports = { userAuth, roleAuth };