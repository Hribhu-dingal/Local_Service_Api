const {
  UserModel,
  UserRegistrationValidationSchema,
  UserLoginValidationSchema
} = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  // ---------------- Registration ----------------
  async registerUser(req, res) {
    try {
      // Validation
      const { error, value } = UserRegistrationValidationSchema.validate(
        req.body,
        {
          abortEarly: false,
        },
      );

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((err) => err.message),
        });
      }

      const { name, email, phone, password, role } = value;

      const existsUser = await UserModel.findOne({ email });
      if (existsUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await UserModel.create({
        name,
        email,
        phone,
        password: hashPassword,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // ---------------- Login ----------------
  async loginUser(req, res) {
    try {
      const { error, value } = UserLoginValidationSchema.validate(req.body, {
        abortEarly: false,
        // allowUnknown: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((err) => err.message),
        });
      }

      const { email, password } = value;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All input fields are required",
        });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" },
      );

      const cookieName =
        user.role === "admin"
          ? "adminToken"
          : user.role === "provider"
            ? "providerToken"
            : "userToken";

      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        role: user.role,
        token: token,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // login using access token and refresh token
  async loginAccessRefresh(req, res) {
    try {
      const { error, value } = UserLoginValidationSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details.map((err) => err.message),
        });
      }
      const { email, password } = value;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All input fields are required",
        });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Create ACCESS TOKEN (short-lived)
      const accessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );

      // Create REFRESH TOKEN (long-lived)
      const refreshToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" },
      );

      // Store refresh token in DB
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token missing" });
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );

      const user = await UserModel.findById(decoded._id);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  }

  async logout(req, res) {
    try {
      const token =
        req.cookies.userToken ||
        req.cookies.adminToken ||
        req.cookies.providerToken;

      if (!token) {
        return res.status(401).json({ message: "Not logged in" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const cookieMap = {
        user: "userToken",
        admin: "adminToken",
        provider: "providerToken",
      };

      const cookieName = cookieMap[decoded.role];

      res.clearCookie(cookieName, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: `${decoded.role} logged out`,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Logout failed" });
    }
  }

  async logoutAccessRefresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await UserModel.updateOne(
          { refreshToken },
          { $unset: { refreshToken: 1 } },
        );
      }

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false, // true in production
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new AuthController();
