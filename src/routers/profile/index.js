'use strict'

const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/profile.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');

//authentication
// router.use(authenticationV2);

router.get('/viewAny', profileController.profiles)
router.get('/viewOwn', profileController.profile)


module.exports = router;