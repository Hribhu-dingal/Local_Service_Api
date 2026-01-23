const ServiceProvider = require("../model/serviceProvider");
const Review = require("../model/review");
const Contact = require("../model/contact");
const Service = require("../model/service");
const Booking = require("../model/booking");

class FrontendController {
  async services(req, res) {
    try {
      const services = await Service.find();
      return res.status(200).json({ success: true, data: services });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async contactCreate(req, res) {
    try {
      const { name, phone, email, message } = req.body;
      if (!name || !phone || !email || !message)
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });

      const contact = await Contact.create({ name, phone, email, message });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: contact.email,
        subject: `Thanks for contacting us`,
        html: `<p>Hello ${contact.name},</p><p>We will reach out to you shortly.</p>`,
      });

      return res.status(200).json({
        success: true,
        message: "Contact form submitted successfully",
        data: contact,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // ---------------- Team / Providers ----------------
  async team(req, res) {
    try {
      const { location, category } = req.query;
      const query = {};
      if (location) query.location = { $regex: location, $options: "i" };
      if (category) query.category = { $regex: category, $options: "i" };

      const serviceProviders = await ServiceProvider.find(query)
        .populate("userId", "name email phone")
        .populate("services", "title");

      const categories = await ServiceProvider.distinct("category");

      return res.status(200).json({
        success: true,
        data: { serviceProviders, categories },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // ---------------- Booking ----------------
  async bookingCreate(req, res) {
    try {
      const { service, date, time } = req.body;
      const providerId = req.params.id;

      const slotTaken = await Booking.exists({
        providerId,
        date,
        time,
        status: { $ne: "Cancelled" },
      });

      if (slotTaken)
        return res
          .status(400)
          .json({ success: false, message: "Slot already booked" });

      const booking = await Booking.create({
        userId: req.user._id,
        providerId,
        service,
        date,
        time,
      });

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  // ---------------- Review ----------------
  async reviewCreate(req, res) {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({ success: false, message: "Login required to add a review" });

      const { rating, comment } = req.body;
      const providerId = req.params.id;

      const review = new Review({
        userId: req.user._id,
        providerId,
        rating,
        comment,
      });

      if (req.file) review.image = req.file.path;
      await review.save();

      // Update average rating
      const reviews = await Review.find({ providerId });
      const avg =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      await ServiceProvider.findByIdAndUpdate(providerId, { rating: avg });

      return res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

}

module.exports = new FrontendController();