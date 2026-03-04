const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.userToken ||
      req.cookies.adminToken ||
      req.cookies.providerToken;

    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded._id).select("-password");

    if (!user) {
      res.clearCookie("userToken");
      res.clearCookie("adminToken");
      res.clearCookie("providerToken");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);

    res.clearCookie("userToken");
    res.clearCookie("adminToken");
    res.clearCookie("providerToken");

    return res.status(401).json({
      message: "Session expired, please login again",
    });
  }
};

const roleAuth = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Please login first" });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          message: `Access denied: only ${role}s can access this`,
        });
      }

      next();
    } catch (err) {
      console.error("RoleAuth error:", err.message);
      return res.status(401).json({ message: "Authorization failed" });
    }
  };
};

module.exports = { userAuth, roleAuth };