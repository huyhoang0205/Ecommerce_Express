'use strict';

const {order} = require('../models/orders.model')

const {
    BadRequestError,
    NotFoundError,
} = require('../cores/error.response');
//repo
const {
    findByUserId,
    deleteCart
} = require('../models/repositories/cart.repo')

const {
    checkProductByServer,
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLockGtV3, releaseLockGtV3 } = require('./redis.service');

class OrderService {

    /*
        {
            cart_id,
            user_id,
            shop_order_ids: [
                {
                    shop_id,
                    shop_discount: [
                        {
                            "shop_id",
                            "discount_id",
                            "code_id"
                        }
                    ],
                    item_products: [
                        {
                            product_id,
                            quantity,
                            price
                        }
                    ],

                }
            ]
        }
    */
    static async orderReview ({
        cart_id, user_id, shop_order_ids, 
    }) {
        const found_cart = await findByUserId({user_id})

        if(!found_cart) throw new BadRequestError('Cart does not exist!');
        console.log("cart_id::::", cart_id)
        console.log("found_cart::::", found_cart._id.toString())
        if(cart_id !== found_cart._id.toString()) throw new BadRequestError('Sorry have some wrong!');

        const checkout_order = {
            total_price: 0,
            fee_ship: 0,
            total_discount: 0,// total value of discounts
            total_checkout:0
        }, shop_order_ids_new = []
        
        for(let i=0; i< shop_order_ids.length; i++ ) { //loop each shop in many shop
            const {shop_id, shop_discounts = [], item_products= {}} = shop_order_ids[i];
            const check_product_in_server = await checkProductByServer(item_products);
            // console.log("check_product_in_server::" , check_product_in_server)
            if(!check_product_in_server[0]) throw new BadRequestError('order wrong!');

            // total without discount
            const checkout_price = check_product_in_server.reduce( (acc, product) => {
                return acc + (product.product_quantity * product.product_price)
            },0)

            checkout_order.total_price = checkout_price
            const items_checkout = {
                shop_id,
                shop_discounts,
                price_raw: checkout_price,
                price_apply_discounts: checkout_price,
                item_products: check_product_in_server
            }
            //assumed shop has one discount on many products
            const  {total_price =0, discount=0} = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    user_id,
                    shop_id,
                    products: check_product_in_server
                })

            checkout_order.total_discount += discount;

            if(discount > 0) {
                items_checkout.price_apply_discounts = checkout_price - discount
            }

            //final
            checkout_order.total_checkout += items_checkout.price_apply_discounts
            shop_order_ids_new.push(items_checkout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cart_id,
        user_id,
        user_address={},
        user_payment={}
    }) {
        const  {shop_order_ids_new, checkout_order} = await OrderService.orderReview({
            cart_id,user_id,shop_order_ids
        })
        //check quantity
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        
        const acquire_products = []
        for (let i =0; i< products.length; i++) {
            const {product_id, product_quantity} = products[i];
            const key_lock = await acquireLockGtV3(product_id, product_quantity, cart_id);
            acquire_products.push(key_lock? true : false);
            if(key_lock) {
                await releaseLockGtV3(key_lock);
            }
        }

        //check if exsist product in cart,
        if(acquire_products.includes(false)) throw new BadRequestError('Have some update, pls reorder!')
        const new_order = await order.create({
            order_user_id: user_id,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new 
        });

        //case if success
        if(new_order) {
            //remove product in my cart
            await deleteCart({user_id})
            
        }
    
        return new_order;
        
    }

    static async getAllOrdersByUser ({user_id}) {
        return await order.find({order_user: user_id}).lean()
    }

    static async getOneOrderByUser ({order_id}) {
        return await order.findOne({_id: order_id}).lean()
    }

    static async cancelOrder() {

    }

    static async updateOrderStatusByShop() {
        
    }
}

module.exports = OrderService