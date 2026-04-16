'use strict'

const {discount} = require('../discount.model')

const {
    convertToObjectIdMongoDb,
    getUnSelectData,
    getSelectData,
} = require('../../utils')

//create
const createNewDiscount = async ({
    name,description,type,value,code,start_date,end_date,max_uses
    ,user_used,max_use_per_user,min_order_value,shop_id,
    is_active,apply_to,product_ids,max_value
}) => {
    return await discount.create({
            discount_name:name,
            discount_description: description,
            discount_type : type,//percentage
            discount_value: value, // 10.000 / 10%
            discount_code : code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,// Maximum number of discount codes that can be used
            discount_user_used: user_used,
            discount_max_use_per_user: max_use_per_user, //Maximum number of discount codes allowed per user
            discount_min_order_value: min_order_value || 0,//minimum order price allowed by discount code
            discount_max_value: max_value,
            discount_shop_id: shop_id,
        
            discount_is_active: is_active,
            discount_apply_to: apply_to,
            discount_product_ids: apply_to === 'all' ? [] : product_ids // Products eligible for discount codes
    })
}


//query
const findByCodeAndId = async (code, shop_id) => {
    return await discount.findOne({
        discount_code: code,
        discount_shop_id: convertToObjectIdMongoDb(shop_id),
    }).lean()
}

const findAllDiscountCodesUnselect = async ({
    limit=50, page=1, sort='ctime',
    filter, un_select 
}) => {
    const skip = (page - 1) * limit;
    const sort_by = sort === 'ctime'? {_id:-1} : {_id:1};
    const discounts = await discount.find(filter)
        .sort(sort_by)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(un_select))
        .lean()

    return discounts
}

const findAllDiscountCodesSelect = async ({
    limit=50, page=1, sort='ctime',
    filter, select 
}) => {
    const skip = (page - 1) * limit;
    const sort_by = sort === 'ctime'? {_id:-1} : {_id:1};
    const discounts = await discount.find(filter)
        .sort(sort_by)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return discounts
}


//update
const updateDiscount = async ({discount_id , user_id, } ) => {
    const updatedDiscount = await discount.findByIdAndUpdate(
        discount_id,{
            $pull: {
                discount_user_used: user_id,
            },
            $inc: {
                discount_max_uses: 1,
                discount_use_count: -1,
            }
        }
    )

    return updatedDiscount
}


//delete
const deleteDiscount = async ({code , shop_id}) => {
    return await discount.findOneAndDelete({
        discount_code: code,
        discount_shop_id: convertToObjectIdMongoDb(shop_id),
    })
}

module.exports = {
    findByCodeAndId,
    createNewDiscount,
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    deleteDiscount,
    updateDiscount
}