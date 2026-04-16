'use strict'

const {
    SuccessResponse,
} = require('../cores/success.response')

const OrderService = require('../services/order.service')

class OrderController {
    orderReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Order Review Successfully!',
            metadata: await OrderService.orderReview(req.body)
        }).send(res);
    }

    orderByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Order  Successfully!',
            metadata: await OrderService.orderByUser({
                ...req.body,
                user_id: req.user.userId
            })
        }).send(res);
    }

    getAllOrdersByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Order  Successfully!',
            metadata: await OrderService.orderByUser({
                user_id: req.user.userId
            })
        }).send(res);
    }

    getOneOrderByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Order  Successfully!',
            metadata: await OrderService.orderByUser(req.params.order_id)
        }).send(res);
    }
}

module.exports = new OrderController()