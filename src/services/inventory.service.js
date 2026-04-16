'use strict'

const {
    BadRequestError
} = require('../cores/error.response')
//repo
const {
    insertStock
} = require('../models/repositories/inventory.repo')

const {
    findOneProduct
} = require('../models/repositories/product.repo')
class InventoryService {
    static async addStockToInventory({
        stock,
        product_id,
        shop_id,
        location = 'HCM'
    }) {
        const product = await findOneProduct({product_id});
        if(!product) throw new BadRequestError('product does not exist!')

        return await insertStock({product_id, shop_id, stock, location})
    }
}

module.exports = InventoryService