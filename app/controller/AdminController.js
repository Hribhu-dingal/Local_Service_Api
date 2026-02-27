const fs = require("fs");
const path = require("path");
const { UserModel } = require("../model/user");
const ServiceProvider = require("../model/serviceProvider");
const Review = require("../model/review");
const Contact = require("../model/contact");
const Service = require("../model/service");
const Booking = require("../model/booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AdminController {
  //Services
  async serviceList(req, res) {
    try {
      const services = await Service.find().populate("providerId", "category");
      res.status(200).json({
        success: true,
        message: "Fetched all services",
        data: services,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async serviceCreate(req, res) {
    try {
      const { title, subtitle, content } = req.body;
      if (!title || !subtitle || !content)
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });

      const service = new Service({ title, subtitle, content });
      if (req.file) service.image = req.file.path;
      await service.save();

      res
        .status(201)
        .json({ success: true, message: "Service created", data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async serviceUpdate(req, res) {
    try {
      const id = req.params.id;
      const updateData = req.body;
      if (req.file) updateData.image = req.file.path;

      const updated = await Service.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Service not found" });

      res
        .status(200)
        .json({ success: true, message: "Service updated", data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async serviceDelete(req, res) {
    try {
      const id = req.params.id;
      const service = await Service.findById(id);
      if (!service)
        return res
          .status(404)
          .json({ success: false, message: "Service not found" });

      if (service.image) {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(service.image),
        );
        fs.unlink(imagePath, () => {});
      }

      await Service.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: "Service deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Contact
  async contactList(req, res) {
    try {
      const contacts = await Contact.find();
      res.status(200).json({
        success: true,
        message: "Fetched all contact messages",
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async contactCreate(req, res) {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !phone)
        return res.status(400).json({
          success: false,
          message: "Name, email, and message required",
        });

      const contact = new Contact({ name, email, phone, message });
      await contact.save();
      res.status(201).json({
        success: true,
        message: "Contact message created",
        data: contact,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async contactDelete(req, res) {
    try {
      await Contact.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Contact deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //  Users
  async userList(req, res) {
    try {
      const users = await UserModel.find();
      res
        .status(200)
        .json({ success: true, message: "Fetched all users", data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async userCreate(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;
      if (!name || !email || !phone || !password)
        return res
          .status(400)
          .json({ success: false, message: "All fields required" });

      const exists = await UserModel.findOne({ email });
      if (exists)
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = new UserModel({ name, email, phone, password: hash, role });
      await user.save();

      res
        .status(201)
        .json({ success: true, message: "User created", data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async userUpdate(req, res) {
    try {
      const id = req.params.id;
      const updated = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res
        .status(200)
        .json({ success: true, message: "User updated", data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async userDelete(req, res) {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Service providers
  async providerList(req, res) {
    try {
      const providers = await ServiceProvider.find().populate(
        "userId",
        "name email",
      );
      res.status(200).json({
        success: true,
        message: "Fetched all service providers",
        data: providers,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async providerCreate(req, res) {
    try {
      const {
        userId,
        category,
        services,
        location,
        availability,
        price,
        rating,
        image,
      } = req.body;
      if (!userId || !category || !services || !location || !availability)
        return res.status(400).json({
          success: false,
          message: "userId, category, and description required",
        });

      services = JSON.parse(services);
      availability = JSON.parse(availability);

      const provider = new ServiceProvider({
        userId,
        category,
        services,
        location,
        availability,
        price,
        rating,
      });
      if (req.file) provider.image = req.file.path;

      await provider.save();
      res.status(201).json({
        success: true,
        message: "Service provider created",
        data: provider,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async providerUpdate(req, res) {
    try {
      const id = req.params.id;
      const provider = await ServiceProvider.findById(id);
      if (!provider)
        return res
          .status(404)
          .json({ success: false, message: "Service provider not found" });

      const updateData = req.body;
      if (req.file) updateData.image = req.file.path;

      const updated = await ServiceProvider.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.status(200).json({
        success: true,
        message: "Service provider updated",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async providerDelete(req, res) {
    try {
      const id = req.params.id;
      const provider = await ServiceProvider.findById(id);
      if (!provider)
        return res
          .status(404)
          .json({ success: false, message: "Service provider not found" });

      if (provider.image) {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          path.basename(provider.image),
        );
        fs.unlink(imagePath, () => {});
      }

      await ServiceProvider.findByIdAndDelete(id);
      res
        .status(200)
        .json({ success: true, message: "Service provider deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //  bookings
  async bookingList(req, res) {
    try {
      const bookings = await Booking.find()
        .populate("userId", "name")
        .populate({
          path: "providerId",
          populate: { path: "userId", select: "name" },
        });
      res
        .status(200)
        .json({ success: true, message: "Fetched bookings", data: bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async bookingConfirm(req, res) {
    try {
      await Booking.findByIdAndUpdate(req.params.id, { status: "Confirmed" });
      res.status(200).json({ success: true, message: "Booking confirmed" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async bookingCancel(req, res) {
    try {
      await Booking.findByIdAndUpdate(req.params.id, { status: "Cancelled" });
      res.status(200).json({ success: true, message: "Booking cancelled" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Reviews
  async reviewList(req, res) {
    try {
      const reviews = await Review.find()
        .populate("userId", "name")
        .populate("providerId", "category");
      res
        .status(200)
        .json({ success: true, message: "Fetched all reviews", data: reviews });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async reviewCreate(req, res) {
    try {
      const { userId, providerId, rating, comment } = req.body;
      if (!userId || !providerId || !rating)
        return res.status(400).json({
          success: false,
          message: "userId, providerId, and rating required",
        });

      const review = new Review({ userId, providerId, rating, comment });
      await review.save();
      res
        .status(201)
        .json({ success: true, message: "Review created", data: review });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async reviewApprove(req, res) {
    try {
      await Review.findByIdAndUpdate(req.params.id, { status: "Approved" });
      res.status(200).json({ success: true, message: "Review Approved" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async reviewReject(req, res) {
    try {
      await Review.findByIdAndUpdate(req.params.id, { status: "Rejected" });
      res.status(200).json({ success: true, message: "Review Rejected" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async reviewDelete(req, res) {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();
