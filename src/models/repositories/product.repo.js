'use strict'

const {product , electronic , clothing , furniture} = require('../product.model');
const {Types} = require('mongoose')
const {
    getSelectData,
    getUnSelectData
} = require('../../utils')

//query
const findAllDraftsForShop = async ({query , limit , skip}) => {
    return await queryProducts({query , limit , skip})
}

const findAllPublishesForShop = async ({query , limit , skip}) => {
    return await queryProducts({query , limit , skip})
}

const searchProductByUser = async ({keySearch}) => {
    const regex = new RegExp(keySearch)
    const results = await product.find({
        isPublish: true,
        $text : {
            $search: regex
        }}, {
        score: {
            $meta: 'textScore'
        }
    }).lean();
    return results;
}

const findAllProducts = async ({limit , sort , page , filter , select }) => {
    const skip = (page -1) * limit;
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1};
    const products = await product.find( filter )
                            .sort(sortBy)
                            .skip(skip)
                            .limit(limit)
                            .select(getSelectData(select))
                            .lean();
    return products
}

const findOneProduct = async ({product_id, unselect}) => {
    return await product.findById(product_id).select(getUnSelectData(unselect))
}


//update

const updateProductById = async({
    productId,
    payload,
    model,
    returnDocument = 'after',
}) => {
        const updateProduct =  await model.findByIdAndUpdate(productId, payload , {
            returnDocument: returnDocument,
        })
        return updateProduct
}

const findByProductShopAndIdAndUpdateIsPublish = async ({product_shop , product_id}) => {
    const foundShop =  await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) {
        return null;
    }
    foundShop.isDraft = false;
    foundShop.isPublish = true;
    const {modifiedCount} = await foundShop.updateOne(foundShop);
    return modifiedCount;
}

const findByProductShopAndIdAndUpdateUnPublish = async ({product_shop , product_id}) => {
    const foundShop =  await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })

    if(!foundShop) {
        return null;
    }
    foundShop.isDraft = true;
    foundShop.isPublish = false;
    const {modifiedCount} = await foundShop.updateOne(foundShop);
    return modifiedCount;
}

//helper
const queryProducts = async ({query , limit , skip}) => {
    return await product.find(query)
                .populate('product_shop','name email -_id')
                .sort({update:-1})
                .skip(skip)
                .limit(limit)
                .lean()
                .exec()
}


module.exports = {
    findAllDraftsForShop,
    findByProductShopAndIdAndUpdateIsPublish,
    findByProductShopAndIdAndUpdateUnPublish,
    findAllPublishesForShop,
    searchProductByUser,
    findAllProducts,
    findOneProduct,
    updateProductById,
}

