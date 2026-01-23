const jwt = require("jsonwebtoken");
const {UserModel} = require("../model/user");

// User Authentication Middleware
const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies.userToken ||
      req.cookies.adminToken ||
      req.cookies.providerToken;

    if (!token) {
      req.flash("message", "Please login to continue");
      return res.redirect("/login");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decoded._id).select("-password");
    if (!user) {
      req.flash("message", "User not found");
      res.clearCookie("userToken");
      res.clearCookie("adminToken");
      res.clearCookie("providerToken");
      return res.redirect("/login");
    }

    req.user = user;
    res.locals.currentUser = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.clearCookie("userToken");
    res.clearCookie("adminToken");
    res.clearCookie("providerToken");
    req.flash("message", "Session expired, please login again");
    return res.redirect("/login");
  }
};



//  Role-based Authorization 
const roleAuth = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        req.flash("message", "Please login first");
        return res.redirect("/login");
      }

      if (req.user.role !== role) {
        req.flash("message", `Access denied: only ${role}s can access this page`);
        return res.redirect("/login");
      }

      next();
    } catch (err) {
      console.error("RoleAuth error:", err.message);
      req.flash("message", "Authorization failed");
      return res.redirect("/login");
    }
  };
};

module.exports = { userAuth, roleAuth };