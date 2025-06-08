const {StatusCodes} = require('http-status-codes');
const {Op} = require('sequelize');
const {Booking}=require('../models');
const CrudRepository = require('./crud-repository');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');

class BookingRepository extends CrudRepository{
    constructor() {
        super(Booking);
    }

    async createBooking(data, transaction) {
        const response = await this.create(data, transaction);
        return response;
    }
    async get(data,transaction){
        const response=await this.model.findByPk(data,{transaction:transaction});  // find by primary key
        if(!response){
            throw new AppError('No data found',StatusCodes.NOT_FOUND);
        }
        return response;
    }
    async update(data,id,transaction){
        const response=await this.model.update(data,{
            where:{
                id:id
            },
            
        },{transaction:transaction})
        // console.log(response);
        if(response[0]===0){
            throw new AppError('No data found to update',StatusCodes.NOT_FOUND);
        }
        return response;
    }
    async cancelOldBookings(timestamp) {
        const response=await this.model.update({status:Enums.BOOKINGSTATUS.CANCELLED},{
            where:{
                [Op.and]:[
                    {
                        createdAt:{
                            [Op.lt]:timestamp
                        },
                    },
                    {
                        status:{
                            [Op.ne]:Enums.BOOKINGSTATUS.BOOKED
                        }
                    },
                    {
                        status:{
                            [Op.ne]:Enums.BOOKINGSTATUS.CANCELLED
                        }
                    }
                ]
            }
        })
        return response;
    }
}

module.exports = BookingRepository;

