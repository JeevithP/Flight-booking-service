const axios=require('axios');
const db=require('../models');
const {BookingRepository}=require('../repositories');
const {ServerConfig}=require('../config');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Enums } = require('../utils/common');

const { where } = require('sequelize');
const { BOOKED,CANCELLED,INITIATED } = Enums.BOOKINGSTATUS;
const {Op}=require('sequelize');

const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try{
        const flight=await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        // console.log('Flight details:', flight.data);
        const flightdata = flight.data.data;

        // console.log(data.noOfSeats, flightdata.totalSeats);
        if(data.noOfSeats > flightdata.totalSeats) {
            throw new AppError('Not enough seats available',StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = flightdata.price * data.noOfSeats;
        console.log('Total billing amount:', totalBillingAmount);
        const bookingPayload={...data, totalCost: totalBillingAmount};
        const booking=await bookingRepository.create(bookingPayload,transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
            seats:data.noOfSeats,
            dec:1
        });

        await transaction.commit();
        return booking;
    }
    catch(error){
        await transaction.rollback();
        throw error;
    }
    
}

async function makePayment(data){
    const transaction=await db.sequelize.transaction();
    try{
        const bookingDetails=await bookingRepository.get(data.bookingId,transaction);

        if(bookingDetails.status!==INITIATED){
            throw new AppError('Booking is not in initiated state',StatusCodes.BAD_REQUEST);
        }

        const dt=new Date(bookingDetails.createdAt);
        const currentDate=new Date();

        console.log('Booking created at:', dt);
        if(bookingDetails.totalCost!=data.totalCost){
            throw new AppError('The amount of the payment doesnt match',StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId!=data.userId){
            throw new AppError('The user corresponding doesnt match',StatusCodes.BAD_REQUEST);
        }
        if(currentDate-dt>300000){ // 5 minutes in milliseconds
            await cancelBooking(data.bookingId,transaction);
            throw new AppError('The booking has expired',StatusCodes.BAD_REQUEST);
        }
        
        await bookingRepository.update({status:BOOKED},data.bookingId,transaction);
        await transaction.commit();

        const updatedBooking = await bookingRepository.get(data.bookingId);
        return updatedBooking;
    }
    catch(error){
        await transaction.rollback();
        throw error;
    }
}
async function cancelBooking(bookingId,transaction){
    // const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(bookingId, transaction);

        if (bookingDetails.status ===CANCELLED) {
            await transaction.commit();
            return true;
        }

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: bookingDetails.noOfSeats,
            dec: 0
        });

        await bookingRepository.update({ status: Enums.BOOKINGSTATUS.CANCELLED }, bookingId, transaction);
        await transaction.commit();

        return { message: 'Booking cancelled successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function cancelOldBookings(timestamp) {
    try{
        const time=new Date(Date.now()-1000*300); // 5 minutes ago
        const response = await bookingRepository.cancelOldBookings(time);
        return response;
    }catch(error){
        console.error('Error cancelling old bookings:', error);
        throw error;
    }
}
module.exports = {
    createBooking,
    makePayment,
    cancelOldBookings
};