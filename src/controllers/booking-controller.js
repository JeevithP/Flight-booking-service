const {BookingService}=require("../services");
const {SuccessResponse,ErrorResponse}=require('../utils/common')
const {StatusCodes}=require('http-status-codes')

async function createBooking(req, res) {
    try {
        // console.log('Request body:', req.body);
        const booking = await BookingService.createBooking({
            flightId:req.body.flightId,
            userId:req.user.id,
            noOfSeats:req.body.noOfSeats,
        });
        // console.log('Booking created:', booking);
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Error in createBooking:', error);
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function makePayment(req, res) {
    try {
        // console.log('Request body:', req.body);
        const booking = await BookingService.makePayment({
            totalCost:req.body.totalCost,
            userId:req.user.id,
            bookingId:req.body.bookingId,
        });
        // console.log('Booking created:', booking);
        return res.status(201).json(booking);
    } catch (error) {
        console.error('Error in payment', error);
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
};