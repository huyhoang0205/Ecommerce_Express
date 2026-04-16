'use strict'

const { BadRequestError } = require('../cores/error.response')
const RESOURCE = require('../models/resource.model')
const ROLE = require('../models/role.model')

const createResource = async ({
    name = 'profile',
    slug = 'p0001',
    description =''
}) => {
    try{
        const holderResource = await RESOURCE.findOne({
            src_name: name
        })
        if(holderResource) throw new BadRequestError("Resource exists!")

        //new resource
        const resource = await RESOURCE.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })
    }catch(e) {
        return e
    }
}

const resourceList = async ({
    user_id=0, // admin
    limit=30,
    offset=0,
    search = ''
}) => {
    try{

        //get list of resource
        const resource = await RESOURCE.aggregate([
            {
                $project: {
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])
        return resource
    }catch(e) {
        return []        
    }
}


const createRole = async ({
    name = 'shop',
    slug = 's00001',
    description = 'extend from user or shop',
    grants = []
}) => {
    try{
        // check role exists
        const holderRole = await ROLE.findOne({
            role_name: name,
            role_status: 'active'
        })
        if(holderRole) {
            throw new BadRequestError("Role exists!")
        }
        // create new role
        const role = await ROLE.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        })

        return role;
    }catch(e) {
        return e
    }
}

const roleList = async ({
    user_id=0, // admin
    limit=30,
    offset=0,
    search = ''
}) => {
    try{
        const roles = await ROLE.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: '$resource'
            },
            {
                $project: {
                    role: '$role_name',
                    resource: '$resource.src_name',
                    actions: '$role_grants.actions',
                    attributes: '$role_grants.attributes'
                }
            },
            {
                $unwind: '$actions'
            },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: '$actions',
                    attributes: 1
                }
            }
        ])

        return roles
    }catch(e) {
        return e
    }
}

module.exports ={
    createResource,
    resourceList,
    createRole,
    roleList
}