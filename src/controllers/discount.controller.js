'use strict';

const DiscountService = require('../services/discount.service');
const {
    SuccessResponse,
} = require('../cores/success.response')

class DiscountController {

    createDiscoundCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Successfully!',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shop_id: req.user.userId,
            })
        }).send(res);
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get All Discount Successfully!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.body,
                shop_id: req.user.userId,
            })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Discount Amount Successfully!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res);
    }

    getDiscountCodeWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Discount Amount Successfully!',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res);
    }


}

module.exports = new DiscountController()