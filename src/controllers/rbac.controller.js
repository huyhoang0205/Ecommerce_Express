'use strict'

const { SuccessResponse } = require("../cores/success.response")

const {
    createResource,
    createRole,
    roleList,
    resourceList
} = require('../services/rbac.service')

class RabcController {
    newRole = async (req, res, next) => {
        new SuccessResponse({
            message:'Create Role Successfully',
            metadata: await createRole(req.body)
        }).send(res)
    }

    newResource = async (req, res, next) => {
        new SuccessResponse({
            message:'Create Resource successfully',
            metadata: await createResource(req.body)
        }).send(res)
    }

    listRole = async (req, res, next) => {
        new SuccessResponse({
            message:'List Role Successfully',
            metadata: await roleList(req.query)
        }).send(res)
    }

    listResource = async (req, res, next) => {
        new SuccessResponse({
            message:'List Resource Successfully',
            metadata: await resourceList(req.query)
        }).send(res)
    }
}

module.exports = new RabcController();