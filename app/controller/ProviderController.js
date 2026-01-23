const ServiceProvider = require('../model/serviceProvider');
const Booking = require('../model/booking');

class ProviderController {
    
    // Task list API
    async taskList(req, res) {
        try {
            const provider = await ServiceProvider.findOne({ userId: req.user._id });

            if (!provider) {
                return res.status(404).json({
                    success: false,
                    message: 'No service provider profile found'
                });
            }

            const bookings = await Booking.find({ providerId: provider._id })
                .populate('userId', 'name email phone')
                .sort({ date: -1 });

            return res.status(200).json({
                success: true,
                message: 'Task list fetched successfully',
                data: bookings
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching task list',
                error: error.message
            });
        }
    }

    // Mark task complete API
    async taskComplete(req, res) {
        try {
            const bookingId = req.params.id;
            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            booking.is_Complete = 'Completed';
            await booking.save();

            return res.status(200).json({
                success: true,
                message: 'Task completed successfully',
                data: booking
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: 'Error completing task',
                error: error.message
            });
        }
    }

}

module.exports = new ProviderController();
