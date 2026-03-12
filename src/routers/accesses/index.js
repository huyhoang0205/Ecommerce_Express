'use strict'

const express = require('express');
const router = express.Router();
const accessesController = require('../../controllers/accesses.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authentication} = require('../../auths/auth.Util');
//sign-up
router.post('/shop/signup', asyncHandler(accessesController.signUp));
router.post('/shop/login', asyncHandler(accessesController.login));

//authentication
router.use(authentication);
//logout
router.post('/shop/logout', asyncHandler(accessesController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessesController.handleRefreshToken));

module.exports = router;