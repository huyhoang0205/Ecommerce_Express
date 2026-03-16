'use strict'

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');

//get
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getDiscountCodeWithProducts))


//authentication
router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscoundCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router;