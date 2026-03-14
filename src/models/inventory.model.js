'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inv_productId:{ type: mongoose.Types.ObjectId, ref: 'Product'},
    inv_location:{ type:String, default: 'unKnow'},
    inv_stock:{type:Number, require: true},
    inv_shopId:{type:mongoose.Types.ObjectId, ref:'Shop'},
    inv_reservation: {type: Array , default: []},

}, {
    timeStamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory : mongoose.model(DOCUMENT_NAME, inventorySchema)
}