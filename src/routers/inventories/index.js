'use strict'

const express = require('express');
const router = express.Router();
const InventoryController = require('../../controllers/inventory.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {grantAccess} = require('../../middlewares/rbac')
const {authenticationV2} = require('../../auths/auth.Util');

//authentication
router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/inventories:
 *  post:
 *      summary: Thêm sản phẩm vào kho hàng [SHOP]
 *      tags: [Inventory]
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
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          stock:
 *                              type: number
 *                              description: số lượng hàng nhập kho
 *                          product_id:
 *                              type: string
 *                              description: ID number đinh danh của sản phẩm
 *                          location:
 *                              type: string
 *                              description: địa chỉ kho
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
router.post('', grantAccess('createOwn','inventories'),asyncHandler(InventoryController.addStockToInventory))

module.exports = router;