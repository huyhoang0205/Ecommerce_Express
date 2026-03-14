'use strict';

const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_thumb:{
        type:String,
        required:true,
    },
    product_description:{
        type:String,
    },
    product_slug: String,
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity:{
        type: Number,
        required:true,
    },
    product_type: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Toys', 'Sports', 'Beauty', 'Automotive', 'Grocery', 'Health' , 'Furnitures'],
        required: true,
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    product_ratingAverage:{
        type: Number,
        default: 4.5,
        min: [1 , "Rating must be above 1.0"],
        max: [5 , "Rating must be lower 5.0"],
        set: (val) => Math.round(val*10) / 10
    },
    product_variation: {
        type : Array,
        default: [],
    },
    isDraft: {type: Boolean , default: true , index: true , select: false},
    isPublish: {type: Boolean , default: false , index: true , select: false},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//create index for full text search // 'text' index type for search full text

productSchema.index({product_name: 'text' , product_description: 'text'})

//Document middleware run before .save() and .create()
productSchema.pre('save',async function() {
    this.product_slug = slugify(this.product_name,{lower:true});
})

//define subcollection for product attributes
const clothingSchema = new mongoose.Schema({
    brand : {type: String , require: true},
    size : String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
}, {
    collection: 'Clothings',
    timestamps: true, 
})

const electronicSchema = new mongoose.Schema({
    manufacture : {type: String , require: true},
    model : String,
    color: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
}, {
    collection: 'Electronics',
    timestamps: true, 
})

const furnitureSchema = new mongoose.Schema({
    brand : {type: String , require: true},
    size : String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
    },
}, {
    collection: 'Furnitures',
    timestamps: true, 
})

//Export the model
module.exports = {
    product : mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic : mongoose.model('Electronic' , electronicSchema),
    furniture : mongoose.model('Furniture' , furnitureSchema),
};