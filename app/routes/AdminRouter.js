const express = require("express");
const AdminController = require("../controller/AdminController");
const { userAuth, roleAuth } = require("../middleware/auth");
const router = express.Router();
const ServiceImage = require("../helper/ServiceImage");

// ================= SERVICES =================

/**
 * @swagger
 * /api/admin/service/list:
 *   get:
 *     summary: Get all Services
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Fetched all services successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 65f2a1b2c3d4e5f678901234
 *                       name:
 *                         type: string
 *                         example: Plumbing
 *                       description:
 *                         type: string
 *                         example: Professional plumbing services
 *                       price:
 *                         type: number
 *                         example: 1500
 *                       category:
 *                         type: string
 *                         example: Home Services
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/service/list",
  userAuth,
  roleAuth("admin"),
  AdminController.serviceList,
);

/**
 * @swagger
 * /api/admin/service/create:
 *   post:
 *     summary: Create a new Service
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Home Cleaning
 *               description:
 *                 type: string
 *                 example: Professional home cleaning service with trained staff.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload an optional service image
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/service/create",
  userAuth,
  roleAuth("admin"),
  ServiceImage.single("image"),
  AdminController.serviceCreate,
);

/**
 * @swagger
 * /api/admin/service/{id}:
 *   put:
 *     summary: Update a Service
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Service Title
 *               description:
 *                 type: string
 *                 example: Updated description for this service
 *               image:
 *                 type: string
 *                 format: binary
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/service/update/:id",
  userAuth,
  roleAuth("admin"),
  ServiceImage.single("image"),
  AdminController.serviceUpdate,
);

/**
 * @swagger
 * /api/admin/service/delete/{id}:
 *   delete:
 *     summary: Delete a Service
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/service/delete/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.serviceDelete,
);

// ================= CONTACT =================

/**
 * @swagger
 * /api/admin/contact/list:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all contact messages
 *       500:
 *         description: Internal server error
 */
router.get(
  "/contact/list",
  userAuth,
  roleAuth("admin"),
  AdminController.contactList,
);


// ----------- Contact ---------
/**
 * @swagger
 * /api/admin/contact/create:
 *   post:
 *     summary: Create a new contact message
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               message:
 *                 type: string
 *                 example: I’d like to know more about your services.
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/contact/create",
  userAuth,
  roleAuth("admin"),
  AdminController.contactCreate,
);

/**
 * @swagger
 * /api/admin/contact/delete/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Contact message deleted successfully
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/contact/delete:id",
  userAuth,
  roleAuth("admin"),
  AdminController.contactDelete,
);



// ================= USERS =================

/**
 * @swagger
 * /api/admin/user/list:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Internal server error
 */
router.get("/user/list", userAuth, roleAuth("admin"), AdminController.userList);

/**
 * @swagger
 * /api/admin/user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/user/create",
  userAuth,
  roleAuth("admin"),
  AdminController.userCreate,
);

/**
 * @swagger
 * /api/admin/user/update/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/user/update/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.userUpdate,
);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/user/delete/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.userDelete,
);



// ================= PROVIDERS =================

/**
 * @swagger
 * /api/admin/provider/list:
 *   get:
 *     summary: Get all service providers
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all service providers
 *       500:
 *         description: Internal server error
 */
router.get(
  "/provider/list",
  userAuth,
  roleAuth("admin"),
  AdminController.providerList,
);

/**
 * @swagger
 * /api/admin/provider/create:
 *   post:
 *     summary: Create a new Service Provider
 *     tags: [Admin]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - category
 *               - services
 *               - location
 *               - availability
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 65f2a1b2c3d4e5f678901234
 *               category:
 *                 type: string
 *                 example: Home Services
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Cleaning","Sanitary"]
 *               location:
 *                 type: string
 *                 example: Mumbai
 *               availability:
 *                 type: string
 *                 description: JSON string of availability array
 *                 example: [{"days":["Monday","Tuesday"],"slots":["10AM-12PM","2PM-4PM"]}]
 *               price:
 *                 type: number
 *                 example: 1500
 *               rating:
 *                 type: number
 *                 example: 4.5
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Upload provider image (optional)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Service provider created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post(
  "/provider/create",
  userAuth,
  roleAuth("admin"),
  ServiceImage.single("image"),
  AdminController.providerCreate
);


/**
 * @swagger
 * /api/admin/provider/update/{id}:
 *   put:
 *     summary: Update a provider
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Provider updated successfully
 *       404:
 *         description: Provider not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/provider/update/:id",
  userAuth,
  roleAuth("admin"),
  ServiceImage.single("image"),
  AdminController.providerUpdate,
);

/**
 * @swagger
 * /api/admin/provider/delete/{id}:
 *   delete:
 *     summary: Delete a provider
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Provider deleted successfully
 *       404:
 *         description: Provider not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/provider/delete/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.providerDelete,
);

// ================= BOOKINGS =================

/**
 * @swagger
 * /api/admin/booking/list:
 *   get:
 *     summary: Get all bookings
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *       500:
 *         description: Internal server error
 */
router.get(
  "/booking/list",
  userAuth,
  roleAuth("admin"),
  AdminController.bookingList,
);

/**
 * @swagger
 * /api/admin/booking/confirm/{id}:
 *   put:
 *     summary: Confirm a booking
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/booking/confirm/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.bookingConfirm,
);

/**
 * @swagger
 * /api/admin/booking/cancel/{id}:
 *   put:
 *     summary: Cancel a booking
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/booking/cancel/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.bookingCancel,
);

// ================= REVIEWS =================

/**
 * @swagger
 * /api/admin/review/list:
 *   get:
 *     summary: Get all reviews
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       500:
 *         description: Internal server error
 */
router.get(
  "/review/list",
  userAuth,
  roleAuth("admin"),
  AdminController.reviewList,
);

/**
 * @swagger
 * /api/admin/review/approve/{id}:
 *   delete:
 *     summary: Approve a review
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review approved successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/review/approve/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.reviewApprove,
);

/**
 * @swagger
 * /api/admin/review/reject/{id}:
 *   delete:
 *     summary: Reject a review
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review rejected successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/review/reject/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.reviewReject,
);

/**
 * @swagger
 * /api/admin/review/delete/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/review/delete/:id",
  userAuth,
  roleAuth("admin"),
  AdminController.reviewDelete,
);

module.exports = router;
