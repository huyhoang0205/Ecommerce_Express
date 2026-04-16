'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME='Comment'
const COLLECTION_NAME='commnets'

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema({
    comment_product_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    commnet_user_id: {type:Number, default : 1},
    comment_content: {type: String, default: 'text'},
    comment_left: {type: Number, default: 0},
    comment_right: {type: Number, default: 0},
    comment_parent_id: {type: mongoose.Schema.Types.ObjectId, ref: DOCUMENT_NAME},
    is_delete: {type: Boolean, default: false}
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    Comment: mongoose.model(DOCUMENT_NAME, commentSchema)
};