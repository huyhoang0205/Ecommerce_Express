'use strict'

const express = require('express');
const router = express.Router();
const rbacController = require('../../controllers/rbac.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')

//authentication
router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/rbac/role:
 *  post:
 *      summary: Tạo bình luận [ADMIN]
 *      tags: [RBAC]
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
 *            description: ID của user
 *            schema:
 *               type: string
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: shipper
 *                          slug:
 *                              type: string
 *                              example: r_00003
 *                          description:
 *                              type: string
 *                          grants:
 *                              type: array
 *                              item:
 *                                  type: object
 *                                  properties:
 *                                      resource:
 *                                          type: string
 *                                          example: resource_id
 *                                      actions:
 *                                          type: array
 *                                          example: ["create:own","read:own","update:own","delete:own", "create:any","read:any","update:any","delete:any"]
 *                                      attributes:
 *                                          type: string
 *                                          example: "*"
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
router.post('/role', grantAccess('createAny','rbac'),asyncHandler(rbacController.newRole))

/**
 * @swagger
 *  /v1/api/rbac/roles:
 *  get:
 *      summary: Lấy danh sách role cùng với hành động được cho phép [ADMIN]
 *      tags: [RBAC]
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
router.get('/roles', grantAccess('readAny','rbac'),asyncHandler(rbacController.listRole))

/**
 * @swagger
 *  /v1/api/rbac/resource:
 *  post:
 *      summary: Tạo resource [ADMIN]
 *      tags: [RBAC]
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
 *            description: ID của user
 *            schema:
 *               type: string
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: product
 *                          slug:
 *                              type: string
 *                              example: prod_00001
 *                          description:
 *                              type: string
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
router.post('/resource', grantAccess('createAny','rbac'),asyncHandler(rbacController.newResource))

/**
 * @swagger
 *  /v1/api/rbac/resources:
 *  get:
 *      summary: Lấy danh sách resource [ADMIN]
 *      tags: [RBAC]
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
router.get('/resources', grantAccess('readAny','rbac') ,asyncHandler(rbacController.listResource))


module.exports = router;