'use strict'

const {
    BadRequestError,
    NotFoundError,
} = require('../cores/error.response')

const {
    convertToObjectIdMongoDb
} = require('../utils')

//repo
const {
    findByCodeAndId,
    createNewDiscount,
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    deleteDiscount,
    updateDiscount,
} = require('../models/repositories/discount.repo')

const {
    findAllProducts,
} = require('../models/repositories/product.repo')

class DiscountService {
    
    //create
    static async createDiscountCode(payload){
        const {
            code, start_date, end_date,
            is_active, shop_id, min_order_value, product_ids, apply_to,max_uses,use_count,
            name, description, type, value, max_value, uses_count, max_use_per_user 
        } = payload;
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw BadRequestError('Discount Code has expried!');
        }

        if(new Date(end_date) <= new Date(start_date) ){
            throw BadRequestError('Start day must be before end day!');
        }
        //create index for discount
        const foundDiscount = await findByCodeAndId(code,shop_id)
        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exist!');
        }

        const newDiscount = await createNewDiscount({
            name,description,type,value,code,start_date,end_date,max_uses,use_count,max_value,max_use_per_user,min_order_value,shop_id,is_active,apply_to,product_ids,uses_count
        })

        return newDiscount;
    }



    //UPDATE//
    static async updateDiscountCode() {

    }

    //END UPDATE//

    //QUERY

    static async getAllDiscountCodesWithProduct({
        code, shop_id, user_id, limit, page
    }) {
        //create index for discount_code
        const foundDiscount = await findByCodeAndId(code,shop_id);
        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exist!')
        }

        const {discount_apply_to , discount_product_ids} = foundDiscount

        let products;

        if(discount_apply_to === 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoDb(shop_id),
                    isPublish: true
                },
                limit: +limit, // convert string to number because parameter is string 
                page: +page,   // example "2" -> +"2" -> 2
                select: ['product_name']
            })
        }

        if(discount_apply_to === 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublish: true
                },
                limit: +limit,
                page: +page,
                select: ['product_name']
            })
        }
        return products;
    }

    static async getAllDiscountCodesByShop( {
        limit,page,shop_id
    } ) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter:{
                discount_shop_id: shop_id,
                discount_is_active: true,
            },
            un_select: ['__v', 'discount_shop_id']
        })
        return discounts
    }


    static async getDiscountAmount({
        code, shop_id, user_id, products
    }) {
        const foundDiscount = await findByCodeAndId(code,shop_id);
        if(!foundDiscount) {
            throw new NotFoundError("Discount not exist!");
        }
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_use_per_user,
            discount_user_used,
            discount_type,
            discount_value,
        } = foundDiscount;

        if(!discount_is_active) {
            throw new NotFoundError("Discount has expried::")
        }
        if(!discount_max_uses) {
            throw new NotFoundError("discount are outdate!")
        }
        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError("Discount Invalid!")
        }
        let totalOrder = 0;
        if(discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.product_quantity * product.product_price)
            },0)
            console.log('totalORder::',totalOrder)
            if(totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}`)
            }
        }

        if(discount_max_use_per_user > 0) {
            const usedDiscoundOfUser =  discount_user_used.find( user => user.userId === user_id)
            if(usedDiscoundOfUser) {
                throw new NotFoundError("Discount Invalid!")
            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        
        return {
            totalOrder,
            discount: amount,
            total_price: totalOrder - amount 
        }

    }

    static async deleteDiscountCode ({shop_id , code}) {
        const deleted = await deleteDiscount({code , shop_id});
        return deleted
    }

    static async cancelDiscountCode({code , shop_id, user_id}) {
        const foundDiscount = await findByCodeAndId(code, shop_id);
        if(!foundDiscount) {
            throw new NotFoundError("Discount not exist!");
        }
        const result = await updateDiscount({
            discount_id: foundDiscount._id,
            user_id: user_id,
        })
        return result;
    }

    //END QUERY//
}

module.exports = DiscountService;