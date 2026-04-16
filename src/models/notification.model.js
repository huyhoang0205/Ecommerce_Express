'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Notification"
const COLLECTION_NAME ='notifications'
// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema({
    noti_type:{type: String, enum: ['ORDER_001', 'ORDER_002', 'SHOP_001', 'PROMOTION_001'], required: true},
    noti_sender_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    noti_receiver_id: {type: Number, required: true, ref: 'Shop'},
    noti_content: {type: String, required: true},
    noti_options: {type: Object, default: {}}
},{
    timestamps: true,
    collation: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);