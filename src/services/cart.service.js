'use strict';


const {
    BadRequestError,
    NotFoundError,
} = require('../cores/error.response')

//repo 
const {
    findByUserId,
    createCart,
    updateQuantityofCart,
    deleteItemInCart,
} = require('../models/repositories/cart.repo')

const {
    findOneProduct,
} = require('../models/repositories/product.repo')

class CartService {

    static async addToCart({user_id , product = {}}) {
        const user_cart = await findByUserId({cast_user_id: user_id })

        if(!user_cart) {
            return await createCart({user_id, product});
        }
        if(!user_cart.cart_products.length) {
            user_cart.cart_products = [product];
            return await user_cart.save();
        }
        
        // if cart exist and product in cart, update quantity of cart
        return await updateQuantityofCart({user_id, product})
    }

    static async addToCartV2({user_id, shop_order_ids }) {
        const {product_id, quantity, old_quantity} = shop_order_ids[0]?.item_products[0];
        //check product exist
        const foundProduct = await findOneProduct({product_id});
        if(!foundProduct) {
            throw new NotFoundError('Product not exist!');
        }

        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id) {
            throw new NotFoundError('Product do not belong to the shop!');
        }

        if(quantity === 0) {
            //delete
        }

        return await updateQuantityofCart({
            user_id, product: {
                product_id,
                quantity: quantity - old_quantity
            }
        })
    }


    static async deleteItemInUserCart({user_id, product_id}) {
        const delete_cart = await deleteItemInCart({user_id, product_id});
        return delete_cart;
    }

    static async getListUserCart({user_id}) {
        return await findByUserId({user_id : Number(user_id)});
    }
}

module.exports = CartService;