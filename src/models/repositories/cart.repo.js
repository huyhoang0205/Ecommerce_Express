'use strict';

const {cart} = require('../carts.model');


//CREATE//
const createCart = async ({user_id, product}) => {
    const query = { cart_user_id: user_id, cart_state:'active'}
    const updateOrInsert = {
        $addToSet: {
            cart_products: product,
        }
    }
    const option = {upsert: true, returnDocument:'after'}
    return await cart.findOneAndUpdate(query,updateOrInsert,option)
}

//QUERY?//
const findByUserId = async ({user_id}) => {
    return await cart.findOne({cart_user_id: user_id})
}


//END QUERY//

//UPDATE//
const updateQuantityofCart = async({user_id, product}) => {
    const {product_id, quantity} = product;
    const query = {
        cart_user_id: user_id,
        'cart_products.product_id': product_id,
        cart_state: 'active',
    }, update = {
        $inc: {
            'cart_products.$.quantity': quantity
        }
    }, option = {upsert: true, returnDocument:'after'}
    return await cart.findOneAndUpdate(query,update,option)
}


//DELETE
const deleteCart = async ({user_id, product_id}) => {
    const query = {cart_user_id: user_id, cart_state: 'active'},
    update = {
        $pull: {
            cart_products: {
                product_id
            }
        }
    }
    return await cart.updateOne(query,update);
}

module.exports = {
    findByUserId,
    createCart,
    updateQuantityofCart,
    deleteCart
}