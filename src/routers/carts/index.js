'use strict'

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/carts.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')


router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/carts:
 *  post:
 *      summary: Thêm sản phẩm vào giỏ hàng của khách hàng và tạo nó nếu chưa tồn tại [USER]
 *      tags: [Cart]
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
 *                          product:
 *                              type: object
 *                              properties:
 *                                      product_id:
 *                                          type: string
 *                                          description: id định danh của sản phẩm
 *                                      shop_id:
 *                                          type: string
 *                                          description: id định danh của shop
 *                                      product_quantity:
 *                                          type: number
 *                                      product_price:
 *                                          type: number
 *                                          description: giá truyển từ front-end sẽ được kiểm tra ở server
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
router.post('', grantAccess('createOwn','carts'),asyncHandler(cartController.addToCart))

/**
 * @swagger
 *  /v1/api/carts:
 *  delete:
 *      summary: Xóa sản phẩm ra khỏi giỏ hàng [USER]
 *      tags: [Cart]
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
 *                          product_id:
 *                              type: string
 *                              description: id number đinh danh của sản phẩm
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
router.delete('', grantAccess('deleteOwn','carts'),asyncHandler(cartController.deleteItemInCart))

/**
 * @swagger
 *  /v1/api/carts:
 *  get:
 *      summary: Lấy danh sách sản phẩm trong giỏ hàng của khách hàng[USER]
 *      tags: [Cart]
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
router.get('', grantAccess('readOwn','carts'),asyncHandler(cartController.listCart))

/**
 * @swagger
 *  /v1/api/carts/update:
 *  post:
 *      summary: Cập nhật số lượng sản phẩm trong giỏ hàng [USER]
 *      tags: [Cart]
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
 *                          shop_order_ids:
 *                              type: array
 *                              description: mảng chưa 1 đối tượng về thông tin cập nhật
 *                              item:
 *                                  type: object
 *                                  properties:
 *                                      shop_id:
 *                                          type: string
 *                                          description: ID định danh của shop
 *                                      item_products:
 *                                          type: array
 *                                          description: danh sách sản phẩm cập nhật
 *                                          item:
 *                                              type: object
 *                                              properties:
 *                                                  quantity:
 *                                                      type: number
 *                                                      description: số lượng cập nhật của sản phẩm
 *                                                  price:
 *                                                      type: number
 *                                                      description: phía front-end cung cấp và sẽ được kiểm tra lại ở server
 *                                                  old_quantity:
 *                                                      type: number
 *                                                      description: số lượng cập nhật trước đó của sản phẩm
 *                                                  product_id:
 *                                                      type: string
 *                                                      description: ID định danh của sản phẩm
 *                                      version:
 *                                          type: number
 *                                          description: để thu thập dữ liệu về sự thay đổi của khách hàng
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
router.post('/update', grantAccess('updateOwn','carts'),asyncHandler(cartController.updateCart))



module.exports = router;