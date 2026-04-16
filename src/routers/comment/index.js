'use strict'

const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment_controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {grantAccess} = require('../../middlewares/rbac')
const {authenticationV2} = require('../../auths/auth.Util');

/**
 * @swagger
 *  /v1/api/comment:
 *  get:
 *      summary: Lấy danh sách các bình luận con của 1 bình luận
 *      tags: [Comments]
 *      parameters:
 *          - in: query
 *            name: product_id
 *            schema:
 *              type: string
 *              description: ID định danh của sản phẩm có bình luận
 *          - in: query
 *            name: parent_comment_id
 *            schema:
 *              type: string
 *              description: ID định danh của bình luận cần lấy các bình luận con
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
router.get('', asyncHandler(commentController.getCommentsByParentId));

router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/comment:
 *  post:
 *      summary: Tạo bình luận [USER]
 *      tags: [Comments]
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
 *                              description: ID number đinh danh của sản phẩm có bình luận
 *                          user_id:
 *                              type: string
 *                              description: ID number đinh danh của khách hàng(user_id)
 *                          content:
 *                              type: string
 *                          parent_comment_id:
 *                              type: number
 *                              description: ID number đinh danh của bình luận 
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
router.post('', grantAccess('createOwn','comment'),asyncHandler(commentController.createComment));

/**
 * @swagger
 *  /v1/api/comment:
 *  delete:
 *      summary: Xóa bình luận
 *      tags: [Comments]
 *      parameters:
 *          - in: query
 *            name: product_id
 *            schema:
 *              type: string
 *              description: ID định danh của sản phẩm có bình luận
 *          - in: query
 *            name: parent_comment_id
 *            schema:
 *              type: string
 *              description: ID định danh của bình luận cần lấy các bình luận con
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
router.delete('', grantAccess('deleteOwn','comment'),asyncHandler(commentController.deleteComments));


module.exports = router;