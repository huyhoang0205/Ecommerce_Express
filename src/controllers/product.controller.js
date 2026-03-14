'use strict';

const ProductService = require('../services/product.service')
const { CREATED,
        OK,
        SuccessResponse,
} = require('../cores/success.response')

class ProductController {


    createNewProduct = async (req , res , next) => {
        new SuccessResponse({
            message: 'create product successfully!',
            metadata: await ProductService.createProduct(req.body.product_type , {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    //PATCH
    updateProduct = async (req , res , next) => {
        new SuccessResponse({
            message: 'Update Product successfully!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId , {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //PUT//
    publishProductByShop = async (req , res , next) => {
        new SuccessResponse({
            message: 'Publish Product successfully!',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    unPublishProductByShop = async (req , res , next) => {
        new SuccessResponse({
            message: 'UnPublish Product successfully!',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res)
    }
    //END PUT//

    //query
    /**
     * Get All Draft For Shop
     * @param {Number} limit 
     * @param {Number} skip 
     * @returns {JSON}
     */
    getAllDraftsForShop = async (req , res , next) => {
        new SuccessResponse({
            message: 'get All Drafts For Shop successfully!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    getAllPublishesForShop = async (req , res , next) => {
        new SuccessResponse({
            message: 'get All Publishes For Shop successfully!',
            metadata: await ProductService.findAllPublishesForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    getListSearchProduct = async (req , res , next) => {
        new SuccessResponse({
            message: 'get List Search Product successfully!',
            metadata: await ProductService.searchProducts(req.params.keySearch)
        }).send(res)
    }

    getListAllProducts = async (req , res , next) => {
        new SuccessResponse({
            message: 'get List All Products successfully!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    getProduct = async (req , res , next) => {
        new SuccessResponse({
            message: 'get Product successfully!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }

    //end query
}

module.exports = new ProductController();