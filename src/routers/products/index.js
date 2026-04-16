'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')



//search Product
/**
 * @swagger
 *  /v1/api/products/search/{keyword}:
 *  get:
 *      summary: tìm kiếm sản phẩm[USER]
 *      tags: [Product]
 *      parameters:
 *          - in: path
 *            name: keyword
 *            schema:
 *              type: string
 *              description: từ khóa dùng để tìm kiếm sản phẩm
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

/**
 * @swagger
 *  /v1/api/products:
 *  get:
 *      summary: Tất cả các sản phẩm đã được publish[USER]
 *      tags: [Product]
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.get('', asyncHandler(productController.getListAllProducts))

/**
 * @swagger
 *  /v1/api/products/{product_id}:
 *  get:
 *      summary: tìm kiếm sản phẩm[USER]
 *      tags: [Product]
 *      parameters:
 *          - in: path
 *            name: product_id
 *            schema:
 *              type: string
 *              description: id định danh của sản phẩm
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: Not Found
 */
router.get('/:product_id', asyncHandler(productController.getProduct))


//authentication
router.use(authenticationV2);
//newProduct
/**
 * @swagger
 *  /v1/api/products:
 *  post:
 *      summary: Tạo sản phẩm [SHOP]
 *      tags: [Product]
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
 *                          product_name:
 *                              type: string
 *                              example: GHẾ BỆT TỰA LƯNG Tatami 5 CẤP ĐỘ GẬP hàng loại 1
 *                          product_description:
 *                              type: string
 *                              example: Ghế Bệt Tựa Lưng Tatami - Sự Lựa Chọn Hoàn Hảo Cho Sự Thoải Mái  Thiết Kế Độc Đáo
 *                          product_thumb:
 *                              type: string
 *                              example: product_thumb/ghebettualung
 *                          product_price:
 *                              type: number
 *                              example: 264000
 *                          product_quantity:
 *                              type: number
 *                              example: 100
 *                          product_type:
 *                              type: string
 *                              example: Furnitures
 *                          product_attributes:
 *                              type: object
 *                              properties:
 *                                  brand:
 *                                      type: string
 *                                      example: ACZ
 *                                  size:
 *                                      type: string
 *                                      example: 100cm x 40cm x 8cm
 *                                  material:
 *                                      type: string
 *                                      example: Dây nhung
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
router.post('', grantAccess('createOwn','products') ,asyncHandler(productController.createNewProduct));

/**
 * @swagger
 *  /v1/api/products/{productId}:
 *  patch:
 *      summary: Cập nhật thông tin sản phẩm [SHOP]
 *      tags: [Product]
 *      parameters:
 *          - in: header
 *            name: x-access-token
 *            required: true
 *            description: accessToken được trả về khi người dùng đăng nhập, đăng ký
 *            schema:
 *               type: string
 *          - in: header
 *            name: x-client-id
 *            required: true
 *            description: ID của shop
 *            schema:
 *               type: string
 *          - in: path
 *            name: productId
 *            required: true
 *            description: ID của sản phẩm
 *            schema:
 *               type: string
 *      requestBody: 
 *          required: true 
 *          description: Những thuộc tính cập nhật của sản phẩm
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object 
 *                      properties:
 *                          product_name:
 *                              type: string
 *                              example: GHẾ BỆT TỰA LƯNG Tatami 5 CẤP ĐỘ GẬP hàng loại 1
 *                          product_price:
 *                              type: number
 *                              example: 264000
 *                          product_quantity:
 *                              type: number
 *                              example: 100
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
router.patch('/:productId',grantAccess('updateOwn','products'), asyncHandler(productController.updateProduct));

/**
 * @swagger
 *  /v1/api/products/publish/{id}:
 *  post:
 *      summary: Phát hành sản phẩm có trên hệ thống và chưa bán cho người dùng[SHOP]
 *      tags: [Product]
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
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID của sản phẩm
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
router.post('/publish/:id',grantAccess('updateOwn','products'), asyncHandler(productController.publishProductByShop));

/**
 * @swagger
 *  /v1/api/products/unpublish/{id}:
 *  post:
 *      summary: Thu hồi sản phẩm có trên hệ thống đã mở bán cho người dùng[SHOP]
 *      tags: [Product]
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
 *          - in: path
 *            name: id
 *            required: true
 *            description: ID của sản phẩm
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
router.post('/unpublish/:id',grantAccess('updateOwn','products'), asyncHandler(productController.unPublishProductByShop));

//query //
/**
 * @swagger
 *  /v1/api/products/drafts/all:
 *  post:
 *      summary: Lấy thông tin sản phẩm có trên hệ thông nhưng chưa bán cho người dùng[SHOP]
 *      tags: [Product]
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
router.get('/drafts/all',grantAccess('readOwn','products'), asyncHandler(productController.getAllDraftsForShop))

/**
 * @swagger
 *  /v1/api/products/drafts/all:
 *  post:
 *      summary: Lấy thông tin sản phẩm có trên hệ thông nhưng đã treo bán cho người dùng[SHOP]
 *      tags: [Product]
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
router.get('/pulished/all',grantAccess('readOwn','products'), asyncHandler(productController.getAllPublishesForShop))

module.exports = router;