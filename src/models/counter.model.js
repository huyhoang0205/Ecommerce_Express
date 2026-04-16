'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Counter'
const COLLECTION_NAME = 'counter'

// Declare the Schema of the Mongo model
var counterSchema = new mongoose.Schema({
    _id:{type: String, required: true},
    seq: {type: Number, default: 1000}
},{
    timestamps: false,
    collection: COLLECTION_NAME   
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, counterSchema);