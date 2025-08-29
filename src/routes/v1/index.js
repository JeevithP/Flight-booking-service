const express = require('express');

const { InfoController } = require('../../controllers');
const bookingRoutes = require('./booking-routes');
const userRoutes = require('./user-routes');
const router = express.Router();

router.get('/info', InfoController.info);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);

module.exports = router;