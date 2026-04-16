'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    order_user:{ type: String, requred: true},
    order_checkout: {type: Object, default: {}},
    /*
        order_checkout: {
            total_price,
            total_price_apply_discount,
            fee_ship
        }
    */
   order_shipping: {type: Object, default:{}},
   /*
        order_shipping: {
            street,
            city,
        }
   */
    order_payment : {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_tracking_number: {type: String, default: "#0000118032026"},
    order_status: {type: String, enum:['pending', 'confirmed', 'shipping', 'cancelled'], default: 'pending'}
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    order: mongoose.model(DOCUMENT_NAME, orderSchema)
};