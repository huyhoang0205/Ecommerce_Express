'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name:{type: String , require: true},
    discount_description: {type: String , require: true},
    discount_type : {type: String , default:'fixed_amount'},//percentage
    discount_value: {type:Number , require: true}, // 10.000 / 10%
    discount_code : {type: String , require: true},
    discount_start_date: {type:Date, require:true},
    discount_end_date: {type: Date, require: true},
    discount_max_uses: {type: Number, require: true},// Maximum number of discount codes that can be used
    discount_use_count: {type: Number, require: true},// number of discount codes used
    discount_user_used: {type: Array , default: []},
    discount_max_use_per_user: {type: Number , require: true}, //Maximum number of discount codes allowed per user
    discount_min_order_value: {type: Number , require:true},//minimum order price allowed by discount code
    discount_max_value: {type:Number, require: true},
    discount_shop_id: {type:mongoose.Types.ObjectId, ref:'Shop'},

    discount_is_active: {type: Boolean, default: true},
    // discount_is_deleted: {type: Boolean, default: false},
    discount_apply_to: {type:String , require: true, enum:['all', 'specific']},
    discount_product_ids: {type: Array, default:[]} // Products eligible for discount codes
}, {
    timeStamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount : mongoose.model(DOCUMENT_NAME, discountSchema)
}