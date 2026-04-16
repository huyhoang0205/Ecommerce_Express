'use strict'

const express = require('express');
const router = express.Router();
const {apiKey , permissions} = require('../auths/check.auth');

//check apiKey
// router.use(apiKey)
//check permissions
// router.use(permissions('0000'))

//email
router.use('/v1/api/email' , require('./email'))
//rbac
router.use('/v1/api/rbac' , require('./rbac'))
//profile
router.use('/v1/api/profile' , require('./profile'))
//inventories
router.use('/v1/api/inventories' , require('./inventories'))
//orders
router.use('/v1/api/orders' , require('./orders'))
//discounts
router.use('/v1/api/discounts' , require('./discounts'))
//carts
router.use('/v1/api/carts' , require('./carts'))
//products
router.use('/v1/api/products' , require('./products'))
//comment
router.use('/v1/api/comment' , require('./comment'))
//notification
router.use('/v1/api/notification' , require('./notification'))
//user
router.use('/v1/api/user' , require('./user'))
//accesses
router.use('/v1/api', require('./accesses'))

module.exports = router;