'use strict'

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')

//get
/**
 * @swagger
 *  /v1/api/discounts/list_product_code:
 *  get:
 *      summary: Lấy danh sách sản phẩm cho phép sử dụng mã giảm giá[USER]
 *      tags: [Discount]
 *      parameters:
 *          - in: query
 *            name: shop_id
 *            schema:
 *              type: string
 *              description: ID định danh của shop
 *          - in: query
 *            name: code
 *            schema:
 *              type: string
 *              description: discount_code
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.get('/list_product_code', asyncHandler(discountController.getDiscountCodeWithProducts))

/**
 * @swagger
 *  /v1/api/discounts/amount:
 *  post:
 *      summary: Tính toán giá khi áp dụng mã giảm giá cho các sản phẩm [USER]
 *      tags: [Discount]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          shop_id:
 *                              type: string
 *                              description: id đinh danh của shop
 *                          code:
 *                              type: string
 *                              description: discount_code
 *                          user_id:
 *                              type: string
 *                              description: id định danh của khách hàng
 *                          products:
 *                              type: array
 *                              item:
 *                                  type: object
 *                                  properties:
 *                                      product_id:
 *                                          type: string
 *                                          description: id định danh của sản phẩm
 *                                      product_quantity:
 *                                          type: number
 *                                      product_price:
 *                                          type: number
 *                                          description: giá truyển từ front-end sẽ được check ở server
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.post('/amount', asyncHandler(discountController.getDiscountAmount))


//authentication
router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/discounts:
 *  post:
 *      summary: Tạo mã giảm giá cho sản phẩm [SHOP]
 *      tags: [Discount]
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
 *                          name:
 *                              type: string
 *                              example: 30/4-1/5 discount for all
 *                          description:
 *                              type: string
 *                              example: description
 *                          type:
 *                              type: string
 *                              description: percentage(phần trăm) hoặc fixed_amount(giá trị cụ thể)
 *                              example: percentage
 *                          value:
 *                              type: number
 *                              example: 10
 *                          discount_max_value:
 *                              type: number
 *                              description: giá trị tối đa có thể giảm
 *                              example: 30000
 *                          code:
 *                              type: string
 *                          start_date:
 *                              type: string
 *                              example: "2026-03-16 09:00:00"
 *                          end_date:
 *                              type: string
 *                              example: "2026-05-16 09:00:00"
 *                          max_uses:
 *                              type: number
 *                              description: số lượng mã giảm giá đươc phát hành
 *                              example: 100
 *                          max_use_per_user:
 *                              type: number
 *                              description: số lượng mã giảm giá được sử dụng trên mỗi khách hàng
 *                              example: 1
 *                          min_order_value:
 *                              type: number
 *                              description: giá trị đơn hàng tối thiểu cho phép sử dụng mã giảm giá
 *                              example: 200000
 *                          is_active:
 *                              type: boolean
 *                              description: mã giảm giá còn hoạt động hay không?
 *                              example: true
 *                          apply_to:
 *                              type: string
 *                              description: all-specific, mã giảm giá áp dụng trên tất cả sản phẩm hay sản phẩm cụ thể
 *                              example: all
 *                          product_ids:
 *                              type: array
 *                              item: 
 *                                  type: string
 *                              description: id sản phẩm được áp dụng mã giảm giá
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
router.post('', grantAccess('createOwn','discounts'),asyncHandler(discountController.createDiscoundCode))

/**
 * @swagger
 *  /v1/api/discounts:
 *  get:
 *      summary: Lấy danh sách mã giảm giá của shop [SHOP]
 *      tags: [Discount]
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
router.get('', grantAccess('readOwn','discounts'),asyncHandler(discountController.getAllDiscountCodes))

module.exports = router;