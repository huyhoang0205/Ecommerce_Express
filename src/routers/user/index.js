'use strict'

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const {authenticationV2} = require('../../auths/auth.Util');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {grantAccess} = require('../../middlewares/rbac')


/**
 * @swagger
 *  /v1/api/user/new_user:
 *  post:
 *      summary: Đăng ký và gửi mail xác nhận[USER]
 *      tags: [USER]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: email nhận đường dẫn xác nhận
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.post('/new_user', asyncHandler(userController.newUser))
router.get('/welcome-back', asyncHandler(userController.checkLoginEmailToken))

/**
 * @swagger
 *  /v1/api/user/login:
 *  post:
 *      summary: Đăng nhập[USER]
 *      tags: [USER]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: email 
 *                          password:
 *                              type: string
 *                              description: password
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.post('/login', asyncHandler(userController.userLogin))

router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/user/handle/refreshToken:
 *  post:
 *      summary: Cấp lại accessToken[USER]
 *      tags: [USER]
 *      parameters:
 *          - in: header
 *            name: x-rtoken-id
 *            required: true
 *            description: refreshToken được trả về khi người dùng đăng nhập, đăng ký
 *            schema:
 *               type: string
 *          - in: header
 *            name: x-client-id
 *            required: true
 *            description: ID của user
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Success
 *          401:
 *              desctiption: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Not Found
 */
router.post('/handle/refreshtoken',grantAccess('updateOwn','RFForUser'), asyncHandler(userController.userHandleRefreshToken))




module.exports = router;