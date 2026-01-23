const express = require('express');
const ProviderController = require('../controller/ProviderController');
const router = express.Router();


/**
 * @swagger
 * /provider/tasks:
 *   get:
 *     summary: Get provider's task list (bookings)
 *     description: Fetches all bookings assigned to the logged-in provider.
 *     tags: [Service Provider]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Task list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       userId:
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *                           email: { type: string }
 *                           phone: { type: string }
 *                       date: { type: string }
 *                       status: { type: string }
 *       404:
 *         description: Provider profile not found
 */
router.get('/tasks', ProviderController.taskList);

/**
 * @swagger
 * /provider/task/{id}/complete:
 *   put:
 *     summary: Mark a booking as completed
 *     description: Updates the status of a specific booking to "Completed".
 *     tags: [Service Provider]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task marked as completed
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Error completing task
 */
router.put('/task/:id/complete', ProviderController.taskComplete);

module.exports = router;
