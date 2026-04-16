'use strict'

const express = require('express');
const router = express.Router();
const notificationcommentController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');

//authentication
router.use(authenticationV2);

router.get('', asyncHandler(notificationcommentController.listNotiByUser));

module.exports = router;