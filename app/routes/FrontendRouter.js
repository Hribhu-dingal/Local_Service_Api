const express = require('express');
const FrontendController = require('../controller/FrontendController');
const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Frontend]
 */
router.get('/services', FrontendController.services);

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Frontend]
 */
router.post('/contact', FrontendController.contactCreate);

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Get service providers list
 *     tags: [Frontend]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 */
router.get('/team', FrontendController.team);

/**
 * @swagger
 * /api/booking/{id}:
 *   post:
 *     summary: Create booking for provider
 *     tags: [Frontend]
 *     security:
 *       - cookieAuth: []
 */
router.post('/booking/:id', FrontendController.bookingCreate);

/**
 * @swagger
 * /api/review/{id}:
 *   post:
 *     summary: Add review for provider
 *     tags: [Frontend]
 *     security:
 *       - cookieAuth: []
 *      
 */
router.post('/review/:id', FrontendController.reviewCreate);



module.exports = router