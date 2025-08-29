const express = require('express');

const router = express.Router();
const { BookingController } = require('../../controllers');
const { authMiddleware } = require('../../middlewares');

router.post('/',authMiddleware, BookingController.createBooking);
router.post('/payments',authMiddleware, BookingController.makePayment);

module.exports = router;