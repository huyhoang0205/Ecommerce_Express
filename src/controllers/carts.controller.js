'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse, CREATED } = require('../cores/success.response')

class CartController {

    addToCart = async (req, res, next) => {
        console.log("req body:::",req.body)
        new SuccessResponse({
            message: 'Add To Cart Successfully!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }


    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart Successfully!',
            metadata: await CartService.addToCartV2({...req.body})
        }).send(res)
    }

    deleteItemInCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Successfully!',
            metadata: await CartService.deleteItemInUserCart({...req.body})
        }).send(res)
    }

    listCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Cart Successfully!',
            metadata: await CartService.getListUserCart({...req.query})
        }).send(res)
    }
}

module.exports = new CartController()