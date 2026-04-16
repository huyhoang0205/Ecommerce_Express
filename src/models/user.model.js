'use strict'

const Counter = require('./counter.model');
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME= 'User'
const COLLECTION_NAME = 'users'

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    user_id:{type : Number, required: true , unique: true},
    user_slug: {type: String, required: true},
    user_name: {type: String, default: ''},
    user_password: {type: String, default:''},
    user_email: {type: String, required: true},
    user_phone: {type: String, default: ''},
    user_sex: {type: String, default:''},
    user_avatar: {type: String, default: ''},
    user_date_of_birth: {type: Date, default: null},
    user_status: {type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    user_role: {type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

userSchema.pre('validate', async function(next) {
    if(this.isNew && !this.user_id) {
            const counter = await Counter.findByIdAndUpdate({
                _id: 'user_id',
            },{
                $inc: {seq: 1}
            },{
                returnDocument: 'after', upsert: true
            })
            this.user_id = counter.seq
    } 
})

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);