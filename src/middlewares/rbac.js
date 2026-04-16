'use strict'

const {AuthFailureError} = require('../cores/error.response')
const {roleList} = require('../services/rbac.service')
const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({user_id:9999}))
            const role_name = req.user.role;
            console.log("ROLE::::",role_name)
            const permissions = rbac.can(role_name)[action](resource);
            if(!permissions.granted) 
                throw new AuthFailureError("You don't have enough permission!!")
            next()
        }
        catch(error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}