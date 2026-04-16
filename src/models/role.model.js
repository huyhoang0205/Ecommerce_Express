'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Role'
const COLLECTION_NAME= 'roles'
// Declare the Schema of the Mongo model
var roleSchema = new mongoose.Schema({
    role_name:{type: String, default: 'user',enum: ['user','shop','admin']},
    role_slug: {type: String, required: true},
    role_status: {type: String, default: 'active', enum:['active', 'block','pending']},
    role_description: {type: String, default:''},
    role_grants: [
        {
            resource: {type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true},
            actions: {type: Array, required: true},
            attributes: {type: String, default: '*'}
        }
    ]
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, roleSchema);