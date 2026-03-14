'use strict'

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');
const {authenticationV2} = require('../../auths/auth.Util');


//search Product
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.getListAllProducts))
router.get('/product_id', asyncHandler(productController.getProduct))


//authentication
router.use(authenticationV2);
//newProduct
router.post('', asyncHandler(productController.createNewProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

//query //
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/pulished/all', asyncHandler(productController.getAllPublishesForShop))

module.exports = router;