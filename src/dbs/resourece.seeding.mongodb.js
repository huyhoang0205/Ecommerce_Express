const RESOURCE = require('../models/resource.model')
const {convertToObjectIdMongoDb} = require('../utils')
const resources = [
    {
        "_id": convertToObjectIdMongoDb("69de0255a1797c420331f40f"),
        "src_name": "products",
        "src_slug": "prod_00001",
        "src_description": "products global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de028df9204c070a5b83a4"),
        "src_name": "discounts",
        "src_slug": "disc_00001",
        "src_description": "discounts global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de02acf9204c070a5b83a6"),
        "src_name": "carts",
        "src_slug": "cart_00001",
        "src_description": "carts global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de02f3f9204c070a5b83a9"),
        "src_name": "orders",
        "src_slug": "ord_00001",
        "src_description": "orders global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de030cf9204c070a5b83ab"),
        "src_name": "inventories",
        "src_slug": "inv_00001",
        "src_description": "inventories global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de031bf9204c070a5b83ad"),
        "src_name": "comment",
        "src_slug": "cmt_00001",
        "src_description": "comment global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de032df9204c070a5b83af"),
        "src_name": "notification",
        "src_slug": "noti_00001",
        "src_description": "notification global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de034df9204c070a5b83b1"),
        "src_name": "email",
        "src_slug": "e_00001",
        "src_description": "email global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de045ef9204c070a5b83b4"),
        "src_name": "rbac",
        "src_slug": "rbac_00001",
        "src_description": "role based access control global",
    },
    {
        "_id": convertToObjectIdMongoDb("69de04a8f9204c070a5b83b7"),
        "src_name": "profile",
        "src_slug": "p_00001",
        "src_description": "profile global",
    },
    {
        "_id": convertToObjectIdMongoDb("69e0a39e79186e5c63c59106"),
        "src_name": "RFForShop",
        "src_slug": "rf_00001",
        "src_description": "refresh token for shop",
    },
    {
        "_id": convertToObjectIdMongoDb("69e0a3cc79186e5c63c5910b"),
        "src_name": "RFForUser",
        "src_slug": "rf_00002",
        "src_description": "refresh token for user",
    }
]

const seedingResources = async () => {
    try {
        const operations = resources.map(resource => ({
            updateOne: {
                filter: { src_name: resource.src_name }, 
                update: { $setOnInsert: resource },      
                upsert: true
            }
        }));
        const result = await RESOURCE.bulkWrite(operations);
        console.log("Seed Resource thành công:", result.upsertedCount, "bản ghi mới.");
    } catch(e) {
        console.error("Lỗi khi seed data của resource:", error);
    }
}

module.exports = {
    seedingResources
}
