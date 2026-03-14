'use strict';

const  {inventory} = require('../inventory.model')
const {Types} = require('mongoose');
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

module.exports = {
    insertInventory,
}