'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts'

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_state:{type: String, require: true, enum: ['active', 'completed', 'failed', 'pending'], default:'active'},
    cart_products: {type: Array, default: [], require: true},
    cart_count_product: {type: Number, default:0},
    cart_user_id: {type: Number, require: true},
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    cart: mongoose.model(DOCUMENT_NAME, cartSchema)
};