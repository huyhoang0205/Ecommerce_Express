'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/carts.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.deleteItemInCart))
router.get('', asyncHandler(cartController.listCart))
router.post('/update', asyncHandler(cartController.updateCart))



module.exports = router;