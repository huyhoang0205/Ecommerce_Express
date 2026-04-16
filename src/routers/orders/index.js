'use strict'

const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/orders_controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')

//authentication
router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/orders/review:
 *  post:
 *      summary: Tính giá trị giỏ hàng áp dụng mã giảm giá [USER]
 *      tags: [Checkout]
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
 *                          cart_id:
 *                              type: string
 *                              description: ID number đinh danh của giỏ hàng
 *                          user_id:
 *                              type: string
 *                              description: ID number đinh danh của khách hàng(user_id)
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
 *                                          description: danh sách sản phẩm trong giỏ hàng cung cấp từ front-end
 *                                          item:
 *                                              type: object
 *                                              properties:
 *                                                  product_quantity:
 *                                                      type: number
 *                                                      description: số lượng cập nhật của sản phẩm
 *                                                  product_price:
 *                                                      type: number
 *                                                      description: phía front-end cung cấp và sẽ được kiểm tra lại ở server
 *                                                  product_id:
 *                                                      type: string
 *                                                      description: ID định danh của sản phẩm
 *                                      shop_discounts:
 *                                          type: array
 *                                          description: danh sách mã giảm giá áp dụng cho giỏ hàng
 *                                          item:
 *                                              type: object
 *                                              properties:
 *                                                  shop_id:
 *                                                      type: string
 *                                                      description: ID định danh của shop 
 *                                                  discount_id:
 *                                                      type: string
 *                                                      description: ID định danh của mã giảm giá 
 *                                                  code:
 *                                                      type: string
 *                                                      description: discount_code 
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
router.post('/review',grantAccess('readOwn','orders'), asyncHandler(OrderController.orderReview))


/**
 * @swagger
 *  /v1/api/orders:
 *  post:
 *      summary: Tạo đơn hàng [USER]
 *      tags: [Checkout]
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
 *                          cart_id:
 *                              type: string
 *                              description: ID number đinh danh của giỏ hàng
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
 *                                          description: danh sách sản phẩm trong giỏ hàng cung cấp từ front-end
 *                                          item:
 *                                              type: object
 *                                              properties:
 *                                                  product_quantity:
 *                                                      type: number
 *                                                      description: số lượng cập nhật của sản phẩm
 *                                                  product_price:
 *                                                      type: number
 *                                                      description: phía front-end cung cấp và sẽ được kiểm tra lại ở server
 *                                                  product_id:
 *                                                      type: string
 *                                                      description: ID định danh của sản phẩm
 *                                      shop_discounts:
 *                                          type: array
 *                                          description: danh sách mã giảm giá áp dụng cho giỏ hàng
 *                                          item:
 *                                              type: object
 *                                              properties:
 *                                                  shop_id:
 *                                                      type: string
 *                                                      description: ID định danh của shop 
 *                                                  discount_id:
 *                                                      type: string
 *                                                      description: ID định danh của mã giảm giá 
 *                                                  code:
 *                                                      type: string
 *                                                      description: discount_code 
 *                          user_address:
 *                              type: object
 *                              properties:
 *                                  street:
 *                                      type: string
 *                                  city:
 *                                      type: string
 *                          user_payment:
 *                              type: object
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
router.post('',grantAccess('createOwn','orders'), asyncHandler(OrderController.orderByUser))


/**
 * @swagger
 *  /v1/api/orders:
 *  get:
 *      summary: Lấy danh sách đơn hàng của khách hàng [USER]
 *      tags: [Checkout]
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
router.get('',grantAccess('readOwn','orders'), asyncHandler(OrderController.getAllOrdersByUser))

/**
 * @swagger
 *  /v1/api/orders/{order_id}:
 *  get:
 *      summary: Lấy thông tin chi tiết của đơn hàng [USER]
 *      tags: [Checkout]
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
 *          - in: path
 *            name: order_id
 *            required: true
 *            description: ID của order
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
router.get('/:order_id',grantAccess('readOwn','orders'), asyncHandler(OrderController.getOneOrderByUser))


module.exports = router;