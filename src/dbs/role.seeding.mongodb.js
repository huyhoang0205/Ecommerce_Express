const ROLE = require('../models/role.model')
const {convertToObjectIdMongoDb} = require('../utils')

const roles = [
    {
        "role_name": "user",
        "role_slug": "r_00002",
        "role_status": "active",
        "role_description": "Role user",
        "role_grants": [
            {
                "resource": convertToObjectIdMongoDb("69de0255a1797c420331f40f"),
                "actions": [
                    "read:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de028df9204c070a5b83a4"),
                "actions": [
                    "read:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de02acf9204c070a5b83a6"),
                "actions": [
                    "create:own",
                    "read:own",
                    "update:own",
                    "delete:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de02f3f9204c070a5b83a9"),
                "actions": [
                    "create:own",
                    "read:own",
                    "update:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de031bf9204c070a5b83ad"),
                "actions": [
                    "read:any",
                    "create:own",
                    "update:own",
                    "delete:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de032df9204c070a5b83af"),
                "actions": [
                    "create:own",
                    "read:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de04a8f9204c070a5b83b7"),
                "actions": [
                    "read:own",
                    "update:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69e0a3cc79186e5c63c5910b"),
                "actions": [
                    "read:own",
                    "update:own"
                ],
                "attributes": "*"
            }
        ],
    },
    {
        "role_name": "shop",
        "role_slug": "r_00001",
        "role_status": "active",
        "role_description": "Role shop",
        "role_grants": [
            {
                "resource": convertToObjectIdMongoDb("69de0255a1797c420331f40f"),
                "actions": [
                    "create:own",
                    "read:own",
                    "update:own",
                    "delete:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de028df9204c070a5b83a4"),
                "actions": [
                    "create:own",
                    "read:own",
                    "update:own",
                    "delete:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de02f3f9204c070a5b83a9"),
                "actions": [
                    "read:own",
                    "update:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de030cf9204c070a5b83ab"),
                "actions": [
                    "read:own",
                    "update:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de031bf9204c070a5b83ad"),
                "actions": [
                    "read:any",
                    "create:own",
                    "update:own",
                    "delete:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de032df9204c070a5b83af"),
                "actions": [
                    "create:own",
                    "read:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de04a8f9204c070a5b83b7"),
                "actions": [
                    "read:own",
                    "update:own"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69e0a39e79186e5c63c59106"),
                "actions": [
                    "create:own",
                    "update:own"
                ],
                "attributes": "*"
            }
        ],
    },
    {
        "role_name": "admin",
        "role_slug": "r_00000",
        "role_status": "active",
        "role_description": "extend from user and shop",
        "role_grants": [
            {
                "resource": convertToObjectIdMongoDb("69de0255a1797c420331f40f"),
                "actions": [
                    "read:any",
                    "delete:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de028df9204c070a5b83a4"),
                "actions": [
                    "read:any",
                    "delete:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de02f3f9204c070a5b83a9"),
                "actions": [
                    "read:any",
                    "update:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de030cf9204c070a5b83ab"),
                "actions": [
                    "read:any",
                    "update:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de031bf9204c070a5b83ad"),
                "actions": [
                    "read:any",
                    "delete:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de032df9204c070a5b83af"),
                "actions": [
                    "create:any",
                    "read:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de045ef9204c070a5b83b4"),
                "actions": [
                    "create:any",
                    "read:any",
                    "update:any",
                    "delete:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de034df9204c070a5b83b1"),
                "actions": [
                    "create:any",
                    "read:any",
                    "update:any",
                    "delete:any"
                ],
                "attributes": "*",
            },
            {
                "resource": convertToObjectIdMongoDb("69de04a8f9204c070a5b83b7"),
                "actions": [
                    "read:any",
                    "update:any"
                ],
                "attributes": "*",
            }
        ],
    }
]

const seedingRoles = async () => {
    try {
            const operations = roles.map(role => ({
                updateOne: {
                    filter: { role_name: role.role_name }, 
                    update: { $setOnInsert: role },      
                    upsert: true
                }
            }));
            const result = await ROLE.bulkWrite(operations);
            console.log("Seed Resource thành công:", result.upsertedCount, "bản ghi mới.");
        } catch(e) {
            console.error("Lỗi khi seed data của role:", error);
        }
}

module.exports = {
    seedingRoles
}