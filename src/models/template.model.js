'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Template'
const COLLECTION_NAME = 'templates'
// Declare the Schema of the Mongo model
var templateSchema = new mongoose.Schema({
    temp_id: {type: Number, required: true},
    temp_name: {type: String, required: true},
    temp_status: {type: String, default: 'active'},
    temp_html: {type: String, required: true}
},{
    timestamps: true,
    collation: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateSchema);