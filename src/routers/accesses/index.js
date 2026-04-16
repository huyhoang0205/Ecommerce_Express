'use strict'

const express = require('express');
const router = express.Router();
const accessesController = require('../../controllers/accesses.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')

//sign-up
/**
 * @swagger
 *  /v1/api/shop/signup:
 *  post:
 *      summary: Đăng ký tài khoản [SHOP]
 *      tags: [Access]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Nguyen Van A"
 *                          email:
 *                              type: string
 *                              example: user@gmail.com
 *                          password:
 *                              type: string
 *                              example: "123456"
 *      responses:
 *          201:
 *              description: created success
 *          404:
 *              description: Not Found
 */
router.post('/shop/signup', asyncHandler(accessesController.signUp));

/**
 * @swagger
 *  /v1/api/shop/login:
 *  post:
 *      summary: Đăng nhập[SHOP]
 *      tags: [Access]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: user@gmail.com
 *                          password:
 *                              type: string
 *                              example: "123456"
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.post('/shop/login', asyncHandler(accessesController.login));


/**
 * @swagger
 *  /v1/api/admin/login:
 *  post:
 *      summary: Đăng nhập[ADMIN]
 *      tags: [ADMIN]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: admin@gmail.com
 *                          password:
 *                              type: string
 *                              example: "admin123"
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.post('/admin/login', asyncHandler(accessesController.admin));

//authentication
router.use(authenticationV2);

//logout
/**
 * @swagger
 *  /v1/api/shop/logout:
 *  post:
 *      summary: Đăng xuất[SHOP]
 *      tags: [Access]
 *      parameters:
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            description: accesstoken được trả về khi người dùng đăng nhập, đăng ký
 *            schema:
 *               type: string
 *          - in: header
 *            name: x-client-id
 *            required: true
 *            description: ID của shop
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
router.post('/shop/logout', asyncHandler(accessesController.logout));

/**
 * @swagger
 *  /v1/api/shop/handleRefreshToken:
 *  post:
 *      summary: Cấp lại accessToken[SHOP]
 *      tags: [Access]
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
 *            description: ID của shop
 *            schema:
 *               type: string
 *      responses:
 *          200:
 *              description: Success
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden
 *          404:
 *              description: Not Found
 */
router.post('/shop/handleRefreshToken',grantAccess('updateOwn','RFForShop'), asyncHandler(accessesController.handleRefreshToken));



module.exports = router;