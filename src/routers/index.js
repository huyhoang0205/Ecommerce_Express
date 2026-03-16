'use strict'

const express = require('express');
const router = express.Router();
const {apiKey , permissions} = require('../auths/check.auth');

//check apiKey
// router.use(apiKey)
//check permissions
// router.use(permissions('0000'))

//discount
router.use('/v1/api/discounts' , require('./discounts'))
//products
router.use('/v1/api/products' , require('./products'))
//accesses
router.use('/v1/api', require('./accesses'))

module.exports = router;