'use strict'

const express = require('express');
const router = express.Router();
const {apiKey , permissions} = require('../auths/check.auth');

//check apiKey
// router.use(apiKey)
//check permissions
// router.use(permissions('0000'))

//products
router.use('/v1/api/products' , require('./products')) // loi logic neu /v1/api/:id router dong ton tai
//accesses
router.use('/v1/api', require('./accesses'))

module.exports = router;