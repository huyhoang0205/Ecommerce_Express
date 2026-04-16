'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse, CREATED } = require('../cores/success.response')

class CartController {

    addToCart = async (req, res, next) => {
        console.log("req body:::",req.body)
        new SuccessResponse({
            message: 'Add To Cart Successfully!',
            metadata: await CartService.addToCart({
                ...req.body,
                user_id: req.user.userId
            })
        }).send(res)
    }


    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart Successfully!',
            metadata: await CartService.addToCartV2({
                ...req.body,
                user_id: req.user.userId
            })
        }).send(res)
    }

    deleteItemInCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Successfully!',
            metadata: await CartService.deleteItemInUserCart({
                ...req.body,
                user_id: req.user.userId
            })
        }).send(res)
    }

    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart Successfully!',
            metadata: await CartService.getListUserCart({
                user_id: req.user.userId
            })
        }).send(res)
    }
}

module.exports = new CartController()