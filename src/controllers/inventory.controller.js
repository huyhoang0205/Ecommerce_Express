'use strict'

const {
    SuccessResponse
} = require('../cores/success.response')
const InventoryService = require('../services/inventory.service');

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add Stock Into Inventory Successfully!',
            metadata: await InventoryService.addStockToInventory({
                ...req.body,
                shop_id: req.user.userId
            })
        })
    }
}

module.exports = new InventoryController()