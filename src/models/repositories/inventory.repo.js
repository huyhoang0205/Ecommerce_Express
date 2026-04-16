'use strict';

const  {inventory} = require('../inventory.model')
const {
    convertToObjectIdMongoDb
} = require('../../utils')
const insertInventory = async ({
    productId , shopId , stock , location = 'unKnow'
}) => {

    return await inventory.create({
        inv_productId: productId,
        inv_stock: stock,
        inv_location: location,
        inv_shopId: shopId
    })

}


//update
const reservationInventory = async ({
    product_id, product_quantity, cart_id
}) => {
    const query = {
        inv_productId : convertToObjectIdMongoDb(product_id),
        inv_stock: {$gte: product_quantity}
    }, update = {
        $inc: {
            inv_stock: - product_quantity
        },
        $push: {
            inv_reservations: {
                product_quantity,
                cart_id,
                createdOn: new Date()
            }
        }
    }, option = {upsert: true, returnDocument:'after'}

    return await inventory.updateOne(query,update,option)
}

const insertStock = async ({
    shop_id, product_id , stock, location
}) => {
    const query = {
        inv_shopId: shop_id,
        inv_productId: product_id
    }, update = {
        $inc: {
            inv_stock: stock,
        },
        $set : {
            inv_location: location
        }
    }, option = {
        upsert: true, returnDocument: 'after'
    }

    return await inventory.findOneAndUpdate(query,update,option)
}

module.exports = {
    insertInventory,
    reservationInventory,
    insertStock
}