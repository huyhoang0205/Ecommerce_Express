'use strict'

const express = require('express');
const router = express.Router();
const emailController = require('../../controllers/email.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');
const {grantAccess} = require('../../middlewares/rbac')

//authentication
router.use(authenticationV2);

/**
 * @swagger
 *  /v1/api/email/new_template:
 *  post:
 *      summary: Tạo template HTML cho gmail xác nhận[ADMIN]
 *      tags: [EMAIL]
 *      requestBody: 
 *          required: true 
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          temp_id:
 *                              type: number
 *                              description: ID number đinh danh cho template
 *                          temp_name:
 *                              type: string
 *                              description: tên cho template
 *                          temp_html:
 *                              type: string
 *                              description: là chuỗi mã html, nếu null sẽ lấy template mặc định xác nhận đăng ký có trong mã nguồn
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
router.post('/new_template', grantAccess('creatAny','email'),asyncHandler(emailController.newTemplate))

module.exports = router;